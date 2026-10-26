import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import multer from "multer";
import { Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { Request, Response } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface PersistedImage {
  id: number;
  nombre: string;
  path: string;
}

function assertCloudinaryConfigured() {
  const missing = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ].filter(name => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno de Cloudinary: ${missing.join(', ')}`);
  }
}

async function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  assertCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'marmoles_thomas', resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (!result?.public_id || !result.secure_url?.startsWith('https://')) {
          reject(new Error('Cloudinary devolvió una respuesta de imagen incompleta'));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if ((file.mimetype || '').startsWith('image/')) {
    return cb(null, true);
  }
  return cb(new Error('No es un tipo de imagen.'));
}

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1
  }
}).array('image', 1);

export async function persistImages(files: Express.Multer.File[], pool: Pool | PoolConnection): Promise<PersistedImage[]> {
  const results: PersistedImage[] = [];

  for (const file of files) {
    const uploaded = await uploadToCloudinary(file.buffer);

    try {
      const [res] = await pool.execute<ResultSetHeader>(
        'INSERT INTO archivos (nombre, path) VALUES (?, ?)',
        [uploaded.public_id, uploaded.secure_url]
      );

      results.push({
        id: res.insertId,
        nombre: uploaded.public_id,
        path: uploaded.secure_url,
      });
    } catch (error) {
      try {
        await deleteCloudinaryAsset(uploaded.public_id);
      } catch (cleanupError) {
        throw new AggregateError([error, cleanupError], 'Falló el guardado de la imagen y su limpieza en Cloudinary');
      }
      throw error;
    }
  }

  return results;
}

async function deleteCloudinaryAsset(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(`Cloudinary no pudo eliminar el recurso ${publicId}`);
  }
}

export async function removeUploadedImages(images: PersistedImage[]) {
  await Promise.all(images.map(image => deleteCloudinaryAsset(image.nombre)));
}

export function runMulter(req: Request, res: Response): Promise<Express.Multer.File[]> {
  return new Promise((resolve, reject) => {
    uploadImages(req, res, (err) => {
      if (err) return reject(err);
      resolve((req.files as Express.Multer.File[]) || []);
    });
  });
}
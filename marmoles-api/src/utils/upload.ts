import { randomUUID } from "crypto";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";
import { Request, Response } from "express";

// Configurar Cloudinary con las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usamos memoryStorage para procesar el archivo en memoria RAM sin guardarlo en disco
const storage = multer.memoryStorage();

// Aceptar solo imágenes
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  if ((file.mimetype || '').startsWith('image/')) {
    return cb(null, true);
  }
  return cb(new Error('No es un tipo de imagen.'));
}

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1
  }
}).array('image', 1);

export async function persistImages(files: Express.Multer.File[], pool: Pool | PoolConnection) {
  const results: { id: number; nombre: string; path: string }[] = [];

  for (const file of files) {
    // Subir la imagen buffer directamente a Cloudinary
    const cloudinaryResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "marmoles_thomas" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const imageName = cloudinaryResponse.public_id;
    const publicPath = cloudinaryResponse.secure_url; // URL HTTPS permanente de Cloudinary

    const [res] = await pool.execute<ResultSetHeader>(
      'INSERT INTO archivos (nombre, path) VALUES (?, ?)',
      [imageName, publicPath]
    );

    results.push({
      id: res.insertId,
      nombre: imageName,
      path: publicPath,
    });
  }

  return results;
}

// Función vacía para mantener compatibilidad con tus controladores
export async function removeUploadedFiles(files: Express.Multer.File[]) {
  // Ya no se requiere borrar archivos locales
}

// Wrap Multer as Promise (for async/await)
export function runMulter(req: Request, res: Response): Promise<Express.Multer.File[]> {
  return new Promise((resolve, reject) => {
    uploadImages(req, res, (err) => {
      if (err) return reject(err);
      resolve((req.files as Express.Multer.File[]) || []);
    });
  });
}
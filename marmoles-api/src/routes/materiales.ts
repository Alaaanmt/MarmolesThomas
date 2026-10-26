import { NextFunction, Request, Response } from 'express';
import { getPool } from '../config/db';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { persistImages, removeUploadedImages, runMulter, type PersistedImage } from '../utils/upload';

const materialTables = {
  granite: 'granitodetalles',
  marble: 'marmoldetalles',
  quartz: 'silestonedetalles',
  melamine: 'melaminadetalles'
} as const;

type Material = keyof typeof materialTables;

function parseMaterial(body: unknown) {
  if (!body || typeof body !== 'object') return null;
  const fields = body as Record<string, unknown>;
  const color = typeof fields.color === 'string' ? fields.color.trim() : '';
  const detalle = typeof fields.detalle === 'string' ? fields.detalle.trim() : '';
  return color && detalle ? { color, detalle } : null;
}

function parseId(value: string | string[] | undefined) {
  if (typeof value !== 'string') return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function crearMaterial(material: Material) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let files: Express.Multer.File[] = [];
    let uploadedImages: PersistedImage[] = [];
    let connection: PoolConnection | undefined;

    try {
      files = await runMulter(req, res);
      const fields = parseMaterial(req.body);
      if (!fields) {
        return res.status(400).json({
          status: 'error',
          message: 'Se requieren "color" y "detalle"'
        });
      }
      if (files.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Se requiere una imagen en el campo "image"'
        });
      }

      connection = await getPool().getConnection();
      await connection.beginTransaction();
      uploadedImages = await persistImages(files, connection);
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO ${materialTables[material]} (color, detalle, imagen_id) VALUES (?, ?, ?)`,
        [fields.color, fields.detalle, uploadedImages[0]?.id ?? null]
      );
      await connection.commit();

      return res.status(201).json({
        status: 'ok',
        data: {
          id: result.insertId,
          ...fields,
          imagen_id: uploadedImages[0]?.id ?? null,
          path: uploadedImages[0]?.path ?? null
        }
      });
    } catch (error) {
      if (connection) await connection.rollback();
      if (uploadedImages.length > 0) {
        try {
          await removeUploadedImages(uploadedImages);
        } catch (cleanupError) {
          return next(new AggregateError([error, cleanupError], 'Falló la operación y la limpieza en Cloudinary'));
        }
      }
      return next(error);
    } finally {
      connection?.release();
    }
  };
}

export function actualizarMaterial(material: Material) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let files: Express.Multer.File[] = [];
    let uploadedImages: PersistedImage[] = [];
    let connection: PoolConnection | undefined;

    try {
      const id = parseId(req.params.id);
      if (!id) {
        return res.status(400).json({ status: 'error', message: 'El id debe ser un entero positivo' });
      }

      files = await runMulter(req, res);
      const fields = parseMaterial(req.body);
      if (!fields) {
        return res.status(400).json({
          status: 'error',
          message: 'Se requieren "color" y "detalle"'
        });
      }

      connection = await getPool().getConnection();
      await connection.beginTransaction();
      const [existing] = await connection.execute<RowDataPacket[]>(
        `SELECT id FROM ${materialTables[material]} WHERE id = ?`,
        [id]
      );
      if (existing.length === 0) {
        await connection.rollback();
        return res.status(404).json({ status: 'error', message: 'No se encontró el material' });
      }

      uploadedImages = files.length ? await persistImages(files, connection) : [];
      await connection.execute(
        `UPDATE ${materialTables[material]} SET color = ?, detalle = ?, imagen_id = COALESCE(?, imagen_id) WHERE id = ?`,
        [fields.color, fields.detalle, uploadedImages[0]?.id ?? null, id]
      );
      await connection.commit();

      return res.json({
        status: 'ok',
        data: {
          id,
          ...fields,
          ...(uploadedImages[0] ? { imagen_id: uploadedImages[0].id, path: uploadedImages[0].path } : {})
        }
      });
    } catch (error) {
      if (connection) await connection.rollback();
      if (uploadedImages.length > 0) {
        try {
          await removeUploadedImages(uploadedImages);
        } catch (cleanupError) {
          return next(new AggregateError([error, cleanupError], 'Falló la operación y la limpieza en Cloudinary'));
        }
      }
      return next(error);
    } finally {
      connection?.release();
    }
  };
}

export function eliminarMaterial(material: Material) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ status: 'error', message: 'El id debe ser un entero positivo' });
    }

    try {
      const [result] = await getPool().execute<ResultSetHeader>(
        `DELETE FROM ${materialTables[material]} WHERE id = ?`,
        [id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ status: 'error', message: 'No se encontró el material' });
      }
      return res.json({ status: 'ok', data: { id } });
    } catch (error) {
      return next(error);
    }
  };
}

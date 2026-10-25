import { NextFunction, Request, Response } from 'express';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getPool } from '../config/db';
import { persistImages, removeUploadedFiles, runMulter } from '../utils/upload';

function parseId(value: string | string[] | undefined) {
  if (typeof value !== 'string') return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseFields(body: unknown) {
  if (!body || typeof body !== 'object') return null;
  const fields = body as Record<string, unknown>;
  const nuestroTrabajoId = Number(fields.nuestroTrabajoId);
  const titulo = typeof fields.titulo === 'string' ? fields.titulo.trim() : '';
  return Number.isInteger(nuestroTrabajoId) && nuestroTrabajoId > 0 && titulo
    ? { nuestroTrabajoId, titulo }
    : null;
}

export async function actualizarDetalleTrabajo(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ status: 'error', message: 'El id debe ser un entero positivo' });
  }

  let files: Express.Multer.File[] = [];
  let connection: PoolConnection | undefined;
  try {
    files = await runMulter(req, res);
    const fields = parseFields(req.body);
    if (!fields) {
      await removeUploadedFiles(files);
      return res.status(400).json({
        status: 'error',
        message: 'Se requieren "nuestroTrabajoId" y "titulo" válidos'
      });
    }

    connection = await getPool().getConnection();
    await connection.beginTransaction();
    const [existing] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM detallestrabajos WHERE id = ?',
      [id]
    );
    if (existing.length === 0) {
      await connection.rollback();
      await removeUploadedFiles(files);
      return res.status(404).json({ status: 'error', message: 'No se encontró el trabajo' });
    }

    const images = files.length ? await persistImages(files, connection) : [];
    await connection.execute(
      'UPDATE detallestrabajos SET nuestroTrabajoId = ?, titulo = ?, imagen_id = COALESCE(?, imagen_id) WHERE id = ?',
      [fields.nuestroTrabajoId, fields.titulo, images[0]?.id ?? null, id]
    );
    await connection.commit();

    return res.json({
      status: 'ok',
      data: {
        id,
        ...fields,
        ...(images[0] ? { imagen_id: images[0].id, imagen: images[0] } : {})
      }
    });
  } catch (error) {
    if (connection) await connection.rollback();
    await removeUploadedFiles(files);
    return next(error);
  } finally {
    connection?.release();
  }
}

export async function eliminarDetalleTrabajo(req: Request, res: Response, next: NextFunction) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ status: 'error', message: 'El id debe ser un entero positivo' });
  }

  try {
    const [result] = await getPool().execute<ResultSetHeader>(
      'DELETE FROM detallestrabajos WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'No se encontró el trabajo' });
    }
    return res.json({ status: 'ok', data: { id } });
  } catch (error) {
    return next(error);
  }
}

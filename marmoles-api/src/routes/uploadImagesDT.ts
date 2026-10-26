import { NextFunction, Request, Response } from 'express';
import { getPool } from '../config/db';
import { persistImages, removeUploadedImages, runMulter, type PersistedImage } from '../utils/upload';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';

export async function subirImagenDT(req: Request, res: Response, next: NextFunction) {
    let files: Express.Multer.File[] = [];
    let uploadedImages: PersistedImage[] = [];
    let connection: PoolConnection | undefined;
    try {
        files = await runMulter(req, res);
        const body = req.body as Record<string, unknown>;
        const nuestroTrabajoId = Number(body.nuestroTrabajoId);
        const titulo = typeof body.titulo === 'string' ? body.titulo.trim() : '';

        if (!Number.isInteger(nuestroTrabajoId) || nuestroTrabajoId < 1 || !titulo) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requiere un "nuestroTrabajoId" válido y un "titulo"'
            });
        }

        if (files.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No se envió ninguna imagen'
            });
        }

        const pool = getPool();
        connection = await pool.getConnection();
        await connection.beginTransaction();
        uploadedImages = await persistImages(files, connection);
        const [rowDetalle] = await connection.execute<ResultSetHeader>(
            'INSERT INTO detallestrabajos (nuestroTrabajoId, titulo, imagen_id) VALUES (?, ?, ?)',
            [nuestroTrabajoId, titulo, uploadedImages[0].id]
        );
        await connection.commit();

        return res.status(201).json({
            status: 'ok',
            data: {
                id: rowDetalle.insertId,
                titulo: titulo,
                nuestroTrabajoId: nuestroTrabajoId,
                imagen: {
                    id: uploadedImages[0].id,
                    nombre: uploadedImages[0].nombre,
                    path: uploadedImages[0].path
                }
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
}
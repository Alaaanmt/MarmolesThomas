import { NextFunction, Request, Response } from 'express';
import { getPool } from '../config/db';
import { persistImages, removeUploadedFiles, runMulter } from '../utils/upload';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';

export async function subirImagenDT(req: Request, res: Response, next: NextFunction) {
    const files = await runMulter(req, res);
    let connection: PoolConnection | undefined;
    try {
        const body = req.body as Record<string, unknown>;
        const nuestroTrabajoId = Number(body.nuestroTrabajoId);
        const titulo = typeof body.titulo === 'string' ? body.titulo.trim() : '';

        if (!Number.isInteger(nuestroTrabajoId) || nuestroTrabajoId < 1 || !titulo) {
            await removeUploadedFiles(files);
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
        const results = await persistImages(files, connection);
        const [rowDetalle] = await connection.execute<ResultSetHeader>(
            'INSERT INTO detallestrabajos (nuestroTrabajoId, titulo, imagen_id) VALUES (?, ?, ?)',
            [nuestroTrabajoId, titulo, results[0].id]
        );
        await connection.commit();

        return res.status(201).json({
            status: 'ok',
            data: {
                id: rowDetalle.insertId,
                titulo: titulo,
                nuestroTrabajoId: nuestroTrabajoId,
                imagen: {
                    id: results[0].id,
                    nombre: results[0].nombre,
                    path: results[0].path
                }
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
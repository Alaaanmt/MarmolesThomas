import { Request, Response } from 'express';
import { getPool } from '../config/db';
import { persistImages, runMulter } from '../utils/upload'
import { Pool, ResultSetHeader } from "mysql2";

export async function subirImagenDT(req: Request, res: Response) {
    try {
        const files = await runMulter(req, res);
        
        const { nuestroTrabajoId, titulo } = req.body as {
            nuestroTrabajoId?: number,
            titulo?: string
        };

        if (!files || files.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No se envió ninguna imagen'
            });
        }

        if (!nuestroTrabajoId || !titulo) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requiere "nuestroTrabajoId" y "titulo"'
            });
        }

        const pool = getPool();

        const results = await persistImages(
            files,
            pool as any
        );

        const [rowDetalle] = await pool.execute<ResultSetHeader>(
            'INSERT INTO detallestrabajos (nuestroTrabajoId, titulo, imagen_id) VALUES (?, ?, ?)',
            [nuestroTrabajoId, titulo, results[0].id]
        )

        const idDetalleTrabajo = rowDetalle.insertId;

        return res.json({
            status: 'ok',
            data: {
                id: idDetalleTrabajo,
                titulo: titulo,
                nuestroTrabajoId: nuestroTrabajoId,
                imagen: {
                    id: results[0].id,
                    nombre: results[0].nombre,
                    path: results[0].path
                }
            }
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
import { Request, Response } from 'express';
import { getPool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export async function trabajos(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT nt.id, nt.titulo, nt.imagen_id, nt.ruta, a.path FROM nuestrostrabajos as nt LEFT JOIN archivos as a ON nt.imagen_id = a.id`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}

export async function trabajosPorId(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT dt.id, dt.nuestroTrabajoId, dt.titulo, dt.imagen_id, a.path FROM detallestrabajos AS dt LEFT JOIN archivos AS a ON dt.imagen_id = a.id WHERE dt.nuestroTrabajoId = ?`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query, [req.params.id]);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}
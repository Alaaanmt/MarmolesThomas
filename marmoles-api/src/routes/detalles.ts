import { Request, Response } from 'express';
import { getPool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export async function detallesGranito(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT gd.id, gd.color, gd.detalle, gd.imagen_id, a.path FROM granitodetalles AS gd LEFT JOIN archivos AS a ON gd.imagen_id = a.id`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}

export async function detallesMarmol(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT md.id, md.color, md.detalle, md.imagen_id, a.path FROM marmoldetalles AS md LEFT JOIN archivos AS a ON md.imagen_id = a.id`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}

export async function detallesMelamina(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT md.id, md.color, md.detalle, md.imagen_id, a.path FROM melaminadetalles AS md LEFT JOIN archivos AS a ON md.imagen_id = a.id`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}

export async function detallesSilestone(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT sd.id, sd.color, sd.detalle, sd.imagen_id, a.path FROM silestonedetalles AS sd LEFT JOIN archivos AS a ON sd.imagen_id = a.id`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}
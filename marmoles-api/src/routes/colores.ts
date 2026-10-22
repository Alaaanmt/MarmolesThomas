import { getPool } from "../config/db";
import { Request, Response } from "express";
import { RowDataPacket } from 'mysql2';

export async function colorGranito(req: Request, res: Response) {
  const pool = getPool();
  var query = `SELECT mc.id, mc.color, mc.imagen_id, a.path FROM granitocolor AS mc LEFT JOIN archivos AS a ON mc.imagen_id = a.id`;
  
  if (
    (typeof req.query.limit === "number" && Number.isFinite(req.query.limit)) ||
    (typeof req.query.limit === "string" && /^\d+$/.test(req.query.limit))
  ) {
    query += ' LIMIT ' + req.query.limit;
  } else {
    console.log("no es numérico.");
  }

  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}

export async function colorMelamina(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT vc.id, vc.color, vc.imagen_id, a.path FROM melaminacolor AS vc LEFT JOIN archivos AS a ON vc.imagen_id = a.id`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}

export async function colorVanitory(req: Request, res: Response) {
  const pool = getPool();
  const query = `SELECT vc.id, vc.color, vc.imagen_id, a.path FROM vanitorycolor AS vc LEFT JOIN archivos AS a ON vc.imagen_id = a.id`;
  
  const [rows] = await pool.query<RowDataPacket[]>(query);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  rows.forEach((row: any) => {
    if (row.path) {
      row.path = `${baseUrl}${row.path}`;
    }
  });

  res.json({ status: 'ok', data: rows });
}
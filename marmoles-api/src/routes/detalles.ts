import { Request, Response } from 'express'
import { getPool } from '../config/db'
import { RowDataPacket } from 'mysql2';

export async function detallesGranito(req: Request, res: Response) {
    const pool = getPool()
    const query = `SELECT gd.id, gd.color, gd.detalle, gd.imagen_id, a.path FROM granitoDetalles AS gd LEFT JOIN archivos AS a ON gd.imagen_id = a.id`
    const [rows] = await pool.query<RowDataPacket[]>(query)

    rows.forEach((row: any) => {
        if (row.path) {
            row.path = `http://localhost:3000${row.path}`
        }
    })

    res.json({
        status: 'ok',
        data: rows
    })
}

export async function detallesMarmol(req: Request, res: Response) {
    const pool = getPool()
    const query = `SELECT md.id, md.color, md.detalle, md.imagen_id, a.path FROM marmolDetalles AS md LEFT JOIN archivos AS a ON md.imagen_id = a.id`
    const [rows] = await pool.query<RowDataPacket[]>(query)

    rows.forEach((row: any) => {
        if (row.path) {
            row.path = `http://localhost:3000${row.path}`
        }
    })

    res.json({
        status: 'ok',
        data: rows
    })
}

export async function detallesMelamina(req: Request, res: Response) {
    const pool = getPool()
    const query = `SELECT md.id, md.color, md.detalle, md.imagen_id, a.path FROM melaminaDetalles AS md LEFT JOIN archivos AS a ON md.imagen_id = a.id`
    const [rows] = await pool.query<RowDataPacket[]>(query)
    
    rows.forEach((row: any) => {
        if (row.path) {
            row.path = `http://localhost:3000${row.path}`
        }
    })

    res.json({
        status: 'ok',
        data: rows
    })
}

export async function detallesSilestone(req: Request, res: Response) {
    const pool = getPool()
    const query = `SELECT sd.id, sd.color, sd.detalle, sd.imagen_id, a.path FROM silestoneDetalles AS sd LEFT JOIN archivos AS a ON sd.imagen_id = a.id`
    const [rows] = await pool.query<RowDataPacket[]>(query)

    rows.forEach((row: any) => {
        if (row.path) {
            row.path = `http://localhost:3000${row.path}`
        }
    })

    res.json({
        status: 'ok',
        data: rows
    })
}
import multer from "multer";
import { randomUUID } from "crypto";
import fs from "fs"
import path from "path";
import { Pool, ResultSetHeader } from "mysql2";
import { Request, Response } from "express";

//Definir la ruta relativa dentro del proyecto
const uploadDir = path.join(process.cwd(), 'uploads');

//Chequear si la carpeta existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        //Va a chequear si el archivo ya existe o viene sin nombre
        const ext = path.extname(file.originalname || '').toLowerCase()
        //Llama al chequeo para poder utilizarlo, sino genera el nombre
        const name = `${randomUUID()}${ext || ''}`
        //lo guarda
        cb(null, name)
    }
})

//Aceptar solo imagenes
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    if ((file.mimetype || '').startsWith('image/')) {
        return cb(null, true)
    }
    return cb(new Error('no es un tipo de imagen.'))
}

export const uploadImages = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 1
    }
}).array('image', 1)

export async function persistImages(files: Express.Multer.File[], pool: Pool) {
    const results: {
        id: number,
        nombre: string,
        path: string
    }[] = []

    for (const element of files) {
        const name = element.filename
        const path = '/uploads/' + name
        const [res] = await pool.execute<ResultSetHeader>(
            'INSERT INTO archivos (nombre, path) VALUES (?, ?)',
            [name, path]
        )
        const insertId = (res as any).insertId as number
        results.push({
            id: insertId,
            nombre: name,
            path: path
        })
    };
    return results
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
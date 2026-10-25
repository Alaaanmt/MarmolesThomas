import { timingSafeEqual } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export function requireAdminApiKey(req: Request, res: Response, next: NextFunction) {
  const configuredKey = process.env.ADMIN_API_KEY;
  if (!configuredKey) {
    return res.status(503).json({
      status: 'error',
      message: 'Las operaciones de administración no están configuradas'
    });
  }

  const authorization = req.get('authorization') ?? '';
  const token = /^Bearer\s+(.+)$/i.exec(authorization)?.[1];
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Se requiere autorización de administrador' });
  }

  const expected = Buffer.from(configuredKey);
  const received = Buffer.from(token);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return res.status(401).json({ status: 'error', message: 'Clave de administrador inválida' });
  }

  return next();
}

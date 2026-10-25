# API de Mármoles Thomas

## Imágenes en Render

La API guarda los archivos en `UPLOAD_DIR`. Si no se define, usa `uploads/` dentro de `marmoles-api`, independientemente del directorio desde el que arranque Node.

El disco del contenedor de Render es efímero. Para que las imágenes sigan disponibles después de un redeploy o reinicio:

1. Añadí un Persistent Disk al servicio de Render, montado en `/var/data`.
2. Configurá `UPLOAD_DIR=/var/data/uploads` en las variables de entorno del servicio.
3. Redeplegá la API. La aplicación crea el subdirectorio si no existe.

La base de datos Aiven conserva la ruta pública de cada imagen; el disco persistente de Render conserva el archivo. También se configura Express para reconocer el proxy HTTPS de Render y generar URLs `https`.

## Operaciones de administración

Las operaciones `POST`, `PUT` y `DELETE` requieren `Authorization: Bearer <ADMIN_API_KEY>`. Configurá un valor secreto y aleatorio para `ADMIN_API_KEY` en Render y enviá el mismo valor desde Postman. Sin la variable configurada, la API rechaza las operaciones de escritura.

Los endpoints de detalle de trabajos aceptan `multipart/form-data`:

| Método | Ruta | Campos |
| --- | --- | --- |
| `POST` | `/uploadDetallesTrabajos` | `nuestroTrabajoId`, `titulo`, `image` (archivo requerido) |
| `PUT` | `/detallestrabajos/:id` | `nuestroTrabajoId`, `titulo`, `image` (opcional) |
| `DELETE` | `/detallestrabajos/:id` | — |

Para crear, editar o borrar materiales de las páginas de detalles, usar `multipart/form-data`. En `POST` y `PUT`, `color` y `detalle` son requeridos; al crear también se requiere `image`. Al editar sin enviar una imagen, se conserva la actual.

| Material | Rutas |
| --- | --- |
| Granito | `/granitodetalles` |
| Mármol | `/marmoldetalles` |
| Silestone | `/silestonedetalles` |
| Melamina | `/melaminadetalles` |

Cada ruta de material permite `POST /ruta`, `PUT /ruta/:id` y `DELETE /ruta/:id`. Las rutas `GET` existentes siguen siendo públicas y no requieren la clave.

Ejemplo de alta de un color en Postman:

- Método `POST`, URL `https://<api>/marmoldetalles`
- Header `Authorization: Bearer <ADMIN_API_KEY>`
- Body `form-data`: `color` (Text), `detalle` (Text), `image` (File)

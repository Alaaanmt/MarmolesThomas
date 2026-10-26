# API de Mármoles Thomas

## Imágenes en Cloudinary

La API sube las imágenes a Cloudinary y guarda en MySQL el `public_id` y la URL HTTPS (`secure_url`). Configurá estas variables de entorno en el servicio de la API (por ejemplo, Render):

| Variable | Valor |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de la cuenta |
| `CLOUDINARY_API_KEY` | API key de la cuenta |
| `CLOUDINARY_API_SECRET` | API secret de la cuenta |

Las credenciales deben estar solo en el backend, nunca en el frontend. Los endpoints de subida fallan con un error explícito si falta alguna variable. Las imágenes nuevas no necesitan un disco persistente. Se mantiene `/uploads` para servir imágenes antiguas guardadas localmente; conservá esas imágenes en `marmoles-api/uploads` o migrá sus registros a Cloudinary antes de quitar el almacenamiento previo.

Los formularios de subida deben usar `multipart/form-data` con una imagen en el campo `image`; se acepta un archivo de hasta 20 MB. La API convierte el buffer en una imagen del folder `marmoles_thomas` en Cloudinary y devuelve la URL HTTPS en `path`. Las respuestas `GET` usan ese mismo campo para que el frontend cargue las imágenes directamente desde Cloudinary.

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

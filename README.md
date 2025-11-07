# ProyectAR - Construcciones Sustentables (Entrega práctica)

## Requisitos cumplidos
- Conexión a "base de datos" (archivo `db.json` en la raíz).
- CRUD completo (API REST en `server.js`) y formulario de registro que usa esas rutas.
- Todas las páginas y recursos son de desarrollo propio (imágenes locales incluidas).
- `README.md` con instrucciones para levantar el entorno.
- Archivo comprimido listo para entregar.

## Requisitos
- Node.js v18+ recomendado
- npm

## Pasos para ejecutar (local)
1. Descargar o descomprimir el proyecto.
2. Abrir terminal en la carpeta del proyecto.
3. Ejecutar:
   ```bash
   npm install
   npm start
   ```
4. Abrir `http://localhost:3000` en el navegador.

## Estructura
- `server.js` - servidor Express que expone la API y sirve `public/`.
- `db.json` - archivo JSON que actúa como base de datos simple.
- `public/` - archivos frontend (index.html, styles.css, script.js, imágenes).

## Endpoints API
- `GET /api/professionals` - obtener todos
- `POST /api/professionals` - crear (body JSON)
- `PUT /api/professionals/:id` - actualizar
- `DELETE /api/professionals/:id` - eliminar


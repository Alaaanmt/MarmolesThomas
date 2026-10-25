# Agent Instructions - Mármoles Thomas (Cotizador Web)

## Contexto del Proyecto
Sitio web institucional y cotizador interactivo para **Mármoles Thomas** (taller de marmolería y amoblamientos a medida). 
El objetivo NO es venta directa ni e-commerce, sino presentar el catálogo de materiales (granitos, mármoles, silestones, melaminas) y muestras de trabajos realizados, guiando al usuario a través de un **flujo de pedido/cotización** (tipo de producto, color/material, medidas o medición sin cargo) para generar un **mensaje directo formateado a WhatsApp**.

## Tech Stack Exacto
- **Frontend:** Vue 3 (Composition API, `<script setup lang="ts">`), TypeScript, Tailwind CSS, Pinia.
- **Backend:** Node.js con Express y MySQL.
- **Color Principal / Branding:** Paleta Cyan (`cyan-600` / `cyan-700` como color primario/accent).

## Gestión de Estado (Pinia + LocalStorage)
- **`Order.ts`:** Store principal en Pinia encargado de persistir el progreso y estado del pedido en `localStorage`. Contiene la información del producto seleccionado (Mueble, Mesada, Vanitory), el color/material, las medidas (o flag de medición a domicilio) y la generación del texto final para WhatsApp.

## Reglas de Arquitectura y Refactorización
1. **Refactorización de Views:** La carpeta `views` contiene mucha lógica mezclada. A partir de lo que hagamos ahora, vamos a desacoplar la lógica hacia composables reutilizables. En otro momento acomodamos la lógica mezclada.
2. **TypeScript Estricto:** Definir interfaces e íconos/tipos para Producto, Categoria, Material y EstadoDelPedido. Prohibido usar `any`.
3. **Tailwind CSS:** Mantener el estándar mobile-first usando la paleta Cyan (`bg-cyan-600`, `text-cyan-700`, `hover:bg-cyan-700`, etc.).

## Directivas para Respuestas del Agente
- Respuestas claras y directas en español.
- Mantener la sintaxis moderna de Vue 3 (`<script setup lang="ts">`).
- Al modificar vistas, priorizar la separación de componentes.
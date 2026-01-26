# PaqariOpenLab

## Crear nuevos posts del blog

1. Copia una plantilla desde `/authoring-templates/` según el tipo de post (article, guide, lab, review).
2. Renombra el archivo con el slug deseado y colócalo en `src/content/blog/es/` o `src/content/blog/en/`.
3. Completa el frontmatter con los campos requeridos y asegúrate de usar categorías válidas:
   - `Educational`, `Entertainment`, `Scientific`
4. Agrega imágenes en `/public/images/blog/` y referencia las rutas desde el frontmatter o los pasos.
5. Para versiones bilingües, reutiliza el mismo `translationKey` en ambos idiomas.

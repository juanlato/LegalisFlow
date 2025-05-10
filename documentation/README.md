# 📂 Carpeta de Documentación de Issues

Este directorio está destinado a almacenar toda la documentación relacionada con los issues de GitHub del proyecto.

## 📌 Propósito

Cada vez que se trabaje en un issue de GitHub, se debe agregar en esta carpeta toda la documentación relevante asociada, incluyendo pero no limitado a:

- Especificaciones técnicas
- Diagramas de arquitectura
- Bocetos de diseño
- Documentación de API
- Decisiones de diseño
- Requisitos funcionales
- Cualquier otro artefacto documental

## 🗂 Estructura recomendada

Para mantener el orden, sigue esta estructura sugerida:

```
documentacion/
│
├── issue/                  # Reemplazar con el nombre del issue general
│   ├── especificaciones.md     # Documentación técnica detallada
│   ├── diagramas/              # Carpeta para diagramas (si aplica)
│   │   ├── flujo.drawio
│   │   └── arquitectura.png
│   └── decisiones.md           # Registro de decisiones importantes
│
└── issue/                  # Otro issue
    └── requisitos.md
```

## ✍️ Buenas prácticas

1. **Nombrado consistente**: Usa `issue` para los nombres de carpeta
2. **Documentación clara**: Incluye siempre un README.md en cada subcarpeta explicando el contenido
3. **Actualización regular**: Mantén la documentación sincronizada con los cambios en el issue
4. **Referencia cruzada**: Incluye en los archivos el enlace al issue correspondiente

## 🔗 Ejemplo de referencia

Para el issue [#123](https://github.com/tu-repo/tu-proyecto/issues/123), crea una carpeta:

```
issue-123/
├── README.md
├── requisitos-funcionales.md
└── diagramas/
    └── flujo-usuario.drawio
```

El archivo README.md dentro de `issue-123/` debería contener un resumen del issue y explicar el propósito de cada documento incluido.
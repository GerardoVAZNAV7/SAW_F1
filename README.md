# Estrategia SAW

Aplicacion web hecha con Vue 3 + Vite para la Tarea 4: un sistema de
apoyo a la decision multicriterio usando el metodo SAW (Simple
Additive Weighting), con el ejemplo de estrategias de neumaticos de
Formula 1 de la Tarea 3.

## Como correrlo

```
npm install
npm run dev
```

Esto levanta un servidor local (normalmente en http://localhost:5173).
Para subirlo a un hosting, generar la version final con:

```
npm run build
```

Eso crea la carpeta `dist/`, que es la que se sube al servicio de
hosting.

## Estructura del proyecto

- `src/saw-calculo.js` -> Todo el calculo matematico del metodo SAW
  (normalizar, ponderar, ordenar y desempatar). Este es el unico
  archivo que hay que leer para entender como funciona el metodo.
- `src/data/alternativas.js` -> Los datos de ejemplo (las 8
  estrategias de neumaticos) y la definicion de los 6 criterios.
- `src/App.vue` -> Componente principal, conecta el formulario con
  la tabla y llama a `calcularSAW`.
- `src/components/FormularioPesos.vue` -> Formulario donde se
  escriben los pesos de cada criterio.
- `src/components/TablaResultados.vue` -> Tabla que muestra las
  alternativas, antes y despues de calcular.
- `src/assets/` -> Imagenes (logo y compuestos de neumaticos). Son
  placeholders genericos, no el logo oficial de F1 (es una marca
  registrada); se pueden reemplazar por otras imagenes con el mismo
  nombre de archivo.

## Notas sobre el metodo

- Los pesos que se escriben en el formulario no necesitan sumar 1:
  la aplicacion los reescala automaticamente antes de calcular.
- El empate se resuelve comparando el criterio de mayor peso primero,
  igual que se pide en la Tarea 4. Si el empate persiste en todos los
  criterios, ambas alternativas quedan con la misma posicion.

// ============================================================
// DATOS DE EJEMPLO
// ============================================================
// Estas son las 8 estrategias de neumaticos de la Tarea 3.
// Cada alternativa tiene:
//   - id y nombre: para identificarla en pantalla
//   - compuestos: los neumaticos que usa, en orden (sirve para
//     mostrar las imagenes de las llantas)
//   - valores: los datos crudos (sin normalizar) de cada criterio,
//     tal cual estan en la tabla de la Tarea 3
// ============================================================

export const alternativas = [
  {
    id: 'A1',
    nombre: 'Medio -> Duro',
    compuestos: ['medio', 'duro'],
    valores: { tiempo: 86.5, duracion: 25, rendimiento: 8.4, degradacion: 3, paradas: 1, riesgo: 3 },
  },
  {
    id: 'A2',
    nombre: 'Medio -> Medio',
    compuestos: ['medio', 'medio'],
    valores: { tiempo: 85.8, duracion: 25, rendimiento: 8.7, degradacion: 4, paradas: 1, riesgo: 4 },
  },
  {
    id: 'A3',
    nombre: 'Blando -> Medio',
    compuestos: ['blando', 'medio'],
    valores: { tiempo: 85.2, duracion: 22, rendimiento: 9.0, degradacion: 6, paradas: 1, riesgo: 5 },
  },
  {
    id: 'A4',
    nombre: 'Blando -> Duro',
    compuestos: ['blando', 'duro'],
    valores: { tiempo: 86.0, duracion: 27, rendimiento: 8.8, degradacion: 5, paradas: 1, riesgo: 4 },
  },
  {
    id: 'A5',
    nombre: 'Duro -> Medio',
    compuestos: ['duro', 'medio'],
    valores: { tiempo: 87.0, duracion: 30, rendimiento: 8.0, degradacion: 2, paradas: 1, riesgo: 3 },
  },
  {
    id: 'A6',
    nombre: 'Medio -> Duro -> Medio',
    compuestos: ['medio', 'duro', 'medio'],
    valores: { tiempo: 85.5, duracion: 18, rendimiento: 9.2, degradacion: 3, paradas: 2, riesgo: 2 },
  },
  {
    id: 'A7',
    nombre: 'Blando -> Medio -> Medio',
    compuestos: ['blando', 'medio', 'medio'],
    valores: { tiempo: 84.9, duracion: 17, rendimiento: 9.4, degradacion: 7, paradas: 2, riesgo: 6 },
  },
  {
    id: 'A8',
    nombre: 'Duro -> Medio -> Blando',
    compuestos: ['duro', 'medio', 'blando'],
    valores: { tiempo: 86.2, duracion: 20, rendimiento: 8.9, degradacion: 4, paradas: 2, riesgo: 5 },
  },
]

// ============================================================
// CRITERIOS
// ============================================================
// clave: como se llama el dato dentro de "valores" (arriba)
// etiqueta: nombre que se muestra al usuario
// unidad: para mostrarla junto al dato en la tabla
// tipo: "beneficio" (mientras mas alto, mejor) o "costo" (mientras
//        mas bajo, mejor). Esto lo usa saw-calculo.js para saber
//        como normalizar cada criterio.
// pesoSugerido: el peso usado en el ejemplo de la Tarea 3, se
//        muestra solo como referencia inicial en el formulario.
// ============================================================

export const criteriosBase = [
  { clave: 'tiempo', etiqueta: 'Tiempo total estimado', unidad: 'min', tipo: 'costo', pesoSugerido: 0.30 },
  { clave: 'duracion', etiqueta: 'Duracion de neumaticos', unidad: 'vueltas', tipo: 'beneficio', pesoSugerido: 0.15 },
  { clave: 'rendimiento', etiqueta: 'Rendimiento promedio', unidad: 'pts', tipo: 'beneficio', pesoSugerido: 0.20 },
  { clave: 'degradacion', etiqueta: 'Riesgo de degradacion', unidad: 'pts', tipo: 'costo', pesoSugerido: 0.15 },
  { clave: 'paradas', etiqueta: 'Numero de paradas', unidad: '', tipo: 'costo', pesoSugerido: 0.10 },
  { clave: 'riesgo', etiqueta: 'Riesgo estrategico', unidad: 'pts', tipo: 'costo', pesoSugerido: 0.10 },
]

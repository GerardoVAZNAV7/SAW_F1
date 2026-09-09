// ============================================================
// CALCULO DEL METODO SAW (Simple Additive Weighting)
// ============================================================
// Este archivo contiene TODA la logica matematica del metodo.
// Se dejo separado del resto del proyecto (que es puramente
// interfaz en Vue) para que se pueda leer y explicar sin tener
// que buscar entre codigo de pantallas, botones, etc.
//
// El metodo SAW se hace en 3 pasos:
//
//   Paso 1 - Normalizar: convertir los valores de cada criterio
//            (que vienen en distintas unidades: minutos, vueltas,
//            puntos...) a una escala comparable entre 0 y 1.
//
//   Paso 2 - Ponderar y sumar: multiplicar cada valor normalizado
//            por el peso de su criterio, y sumar todo. Esto da
//            una sola calificacion final por alternativa.
//
//   Paso 3 - Ordenar: acomodar las alternativas de la mejor
//            calificacion a la peor, resolviendo empates.
// ============================================================


// ------------------------------------------------------------
// PASO 1: Normalizar un criterio
// ------------------------------------------------------------
// Recibe la lista de valores de UN criterio (por ejemplo, el
// tiempo de las 8 alternativas) y el tipo de ese criterio.
//
// Si es un criterio de BENEFICIO (mientras mas alto, mejor,
// como el rendimiento):
//     valor_normalizado = valor / valor_maximo_de_la_lista
//
// Si es un criterio de COSTO (mientras mas bajo, mejor,
// como el tiempo o el riesgo):
//     valor_normalizado = valor_minimo_de_la_lista / valor
//
// En ambos casos el resultado queda entre 0 y 1, y el mejor
// valor de la lista siempre termina en 1.
// ------------------------------------------------------------
export function normalizarCriterio(valores, tipo) {
  const maximo = Math.max(...valores)
  const minimo = Math.min(...valores)

  return valores.map((valor) => {
    if (tipo === 'beneficio') {
      return valor / maximo
    }
    // tipo === 'costo'
    return minimo / valor
  })
}


// ------------------------------------------------------------
// PASO 2: Calcular la puntuacion SAW de cada alternativa
// ------------------------------------------------------------
// alternativas: lista de productos/estrategias. Cada uno debe
//   tener un campo "valores" con sus datos crudos por criterio.
//   Ejemplo: { id: 'A1', valores: { tiempo: 86.5, riesgo: 3 } }
//
// criterios: lista de criterios con su peso ya asignado.
//   Ejemplo: { clave: 'tiempo', tipo: 'costo', peso: 0.30 }
//
// El peso de cada criterio se usa tal cual se recibe, por eso
// antes de llamar esta funcion hay que asegurarse de que los
// pesos ya esten normalizados (que sumen 1). Eso se hace en
// normalizarPesos(), mas abajo.
// ------------------------------------------------------------
function calcularPuntuaciones(alternativas, criterios) {
  // Se normaliza cada criterio por separado. Se guarda el
  // resultado en un objeto: { tiempo: [0.98, 0.99, ...], ... }
  const normalizadosPorCriterio = {}

  criterios.forEach((criterio) => {
    const valoresDelCriterio = alternativas.map((alt) => alt.valores[criterio.clave])
    normalizadosPorCriterio[criterio.clave] = normalizarCriterio(valoresDelCriterio, criterio.tipo)
  })

  // Ahora se recorre cada alternativa y se suma:
  //   valor_normalizado_del_criterio * peso_del_criterio
  // para cada uno de los criterios. Esa suma es la puntuacion SAW.
  return alternativas.map((alternativa, indice) => {
    const normalizado = {}
    let puntuacion = 0

    criterios.forEach((criterio) => {
      const valorNormalizado = normalizadosPorCriterio[criterio.clave][indice]
      normalizado[criterio.clave] = valorNormalizado
      puntuacion += valorNormalizado * criterio.peso
    })

    return {
      ...alternativa,
      normalizado,
      puntuacion,
    }
  })
}


// ------------------------------------------------------------
// PASO 3: Ordenar y resolver empates
// ------------------------------------------------------------
// Regla de empate pedida en la tarea:
//   Si dos alternativas quedan con la misma puntuacion, se
//   desempatan comparando el criterio con MAYOR peso. Si siguen
//   empatadas, se compara el siguiente criterio en peso, y asi
//   sucesivamente. Si el empate sigue en todos los criterios,
//   se les asigna la misma posicion en el ranking.
// ------------------------------------------------------------

// Una pequeña tolerancia para comparar numeros decimales.
// (0.30000001 y 0.3 deben tratarse como el mismo numero)
const TOLERANCIA = 0.0001

function sonIguales(a, b) {
  return Math.abs(a - b) < TOLERANCIA
}

// Compara dos alternativas para decidir cual va primero.
// Devuelve un numero negativo si "a" va antes que "b",
// positivo si "b" va antes que "a", o 0 si estan totalmente
// empatadas.
function compararAlternativas(a, b, criteriosOrdenadosPorPeso) {
  // Primero se compara la puntuacion total.
  if (!sonIguales(a.puntuacion, b.puntuacion)) {
    return b.puntuacion - a.puntuacion
  }

  // Hay empate en la puntuacion total: se revisa criterio por
  // criterio, empezando por el de mayor peso.
  for (const criterio of criteriosOrdenadosPorPeso) {
    const valorA = a.normalizado[criterio.clave]
    const valorB = b.normalizado[criterio.clave]

    if (!sonIguales(valorA, valorB)) {
      return valorB - valorA
    }
  }

  // Empate total, incluso comparando todos los criterios.
  return 0
}

function ordenarYAsignarPosiciones(resultados, criterios) {
  // Los criterios se ordenan de mayor peso a menor peso, porque
  // asi se debe desempatar segun la tarea.
  const criteriosOrdenadosPorPeso = [...criterios].sort((a, b) => b.peso - a.peso)

  resultados.sort((a, b) => compararAlternativas(a, b, criteriosOrdenadosPorPeso))

  // Se recorre la lista ya ordenada asignando la posicion.
  // Si una alternativa quedo totalmente empatada con la anterior
  // (compararAlternativas devuelve 0), recibe la misma posicion.
  resultados.forEach((resultado, indice) => {
    if (indice === 0) {
      resultado.posicion = 1
      return
    }

    const anterior = resultados[indice - 1]
    const empateTotal = compararAlternativas(resultado, anterior, criteriosOrdenadosPorPeso) === 0

    resultado.posicion = empateTotal ? anterior.posicion : indice + 1
  })

  return resultados
}


// ------------------------------------------------------------
// Ajusta los pesos para que siempre sumen 1 (100%)
// ------------------------------------------------------------
// El usuario puede escribir pesos que no sumen exactamente 1
// (por ejemplo 3, 2 y 5 en vez de 0.3, 0.2 y 0.5). Esta funcion
// los reescala automaticamente para que sumen 1, sin cambiar la
// proporcion entre ellos.
// ------------------------------------------------------------
export function normalizarPesos(criterios) {
  const sumaDePesos = criterios.reduce((suma, criterio) => suma + criterio.peso, 0)

  if (sumaDePesos === 0) {
    return criterios
  }

  return criterios.map((criterio) => ({
    ...criterio,
    peso: criterio.peso / sumaDePesos,
  }))
}


// ------------------------------------------------------------
// Funcion principal: esta es la unica funcion que necesita usar
// la interfaz (App.vue) para obtener el ranking completo.
// ------------------------------------------------------------
// Recibe las alternativas y los criterios con peso, y devuelve
// la lista de alternativas con: normalizado, puntuacion y
// posicion, lista de mejor a peor.
// ------------------------------------------------------------
export function calcularSAW(alternativas, criterios) {
  const pesosNormalizados = normalizarPesos(criterios)
  const resultados = calcularPuntuaciones(alternativas, pesosNormalizados)
  return ordenarYAsignarPosiciones(resultados, pesosNormalizados)
}

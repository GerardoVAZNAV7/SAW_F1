<script setup>
// Este componente dibuja la tabla y deja que el usuario escriba
// nuevos valores en la matriz de decision (los datos crudos, antes
// de normalizar). No hace ningun calculo de SAW aqui: eso sigue
// viviendo unicamente en saw-calculo.js.

import imagenDuro from '../assets/duros.png'
import imagenMedio from '../assets/medios.png'
import imagenBlando from '../assets/blandos.png'

defineProps({
  alternativas: {
    type: Array,
    required: true,
  },
  criterios: {
    type: Array,
    required: true,
  },
  calculado: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['restablecer'])

// Convierte el nombre de un compuesto ('duro', 'medio', 'blando')
// en la imagen de la llanta correspondiente.
const imagenesPorCompuesto = {
  duro: imagenDuro,
  medio: imagenMedio,
  blando: imagenBlando,
}

function imagenDeCompuesto(compuesto) {
  return imagenesPorCompuesto[compuesto]
}
</script>

<template>
  <section class="panel">
    <div class="panel-encabezado">
      <div>
        <h2 class="panel-titulo">2. Matriz de decision</h2>
        <p class="panel-ayuda">
          <span v-if="!calculado">
            Estos son los datos crudos, antes de normalizar. Puedes cambiar
            cualquier numero para jugar con la matriz y ver como cambia el
            resultado.
          </span>
          <span v-else>
            Estrategias ordenadas de mayor a menor calificacion SAW. Los
            valores se pueden seguir editando; vuelve a presionar
            "Calcular ranking" para ver el nuevo resultado.
          </span>
        </p>
      </div>
      <button class="boton-restablecer" @click="emit('restablecer')">
        Restablecer valores originales
      </button>
    </div>

    <div class="tabla-contenedor">
      <table>
        <thead>
          <tr class="fila-grupo">
            <th
              v-if="calculado"
              class="col-posicion"
              rowspan="2"
              scope="colgroup"
            >
              Pos.
            </th>
            <th class="col-estrategia" rowspan="2" scope="colgroup">Estrategia</th>
            <th class="col-titulo-criterios" :colspan="criterios.length" scope="colgroup">
              Criterios de evaluacion
              <span class="grupo-detalle">matriz de datos crudos</span>
            </th>
            <th
              v-if="calculado"
              class="col-puntuacion"
              rowspan="2"
              scope="colgroup"
            >
              Calificacion SAW
            </th>
          </tr>
          <tr class="fila-etiquetas">
            <th v-for="criterio in criterios" :key="criterio.clave" class="col-criterio" scope="col">
              <span class="criterio-etiqueta">{{ criterio.etiqueta }}</span>
              <span v-if="criterio.unidad" class="criterio-unidad">{{ criterio.unidad }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alternativa in alternativas" :key="alternativa.id">
            <td v-if="calculado" class="col-posicion">
              <span class="numero-posicion" :class="{ primero: alternativa.posicion === 1 }">
                {{ alternativa.posicion }}
              </span>
            </td>
            <td class="col-estrategia">
              <div class="estrategia-encabezado">
                <span class="estrategia-id">{{ alternativa.id }}</span>
                <span class="estrategia-nombre">{{ alternativa.nombre }}</span>
              </div>
              <div class="estrategia-llantas">
                <img
                  v-for="(compuesto, indice) in alternativa.compuestos"
                  :key="indice"
                  :src="imagenDeCompuesto(compuesto)"
                  :alt="compuesto"
                  class="icono-llanta"
                />
              </div>
            </td>
            <td v-for="criterio in criterios" :key="criterio.clave" class="col-valor">
              <input
                type="number"
                min="0"
                step="0.1"
                class="entrada-valor"
                v-model.number="alternativa.valores[criterio.clave]"
              />
            </td>
            <td v-if="calculado" class="col-puntuacion">
              {{ alternativa.puntuacion.toFixed(4) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: var(--gris-asfalto);
  border: 1px solid var(--gris-panel);
  padding: 24px;
  margin-top: 24px;
}

.panel-encabezado {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.panel-titulo {
  font-family: var(--fuente-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0 0 4px;
}

.panel-ayuda {
  color: var(--gris-acero);
  font-size: 13px;
  margin: 0;
  max-width: 60ch;
}

.boton-restablecer {
  background: transparent;
  border: 1px solid var(--gris-acero);
  color: var(--gris-acero);
  font-family: var(--fuente-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 9px 16px;
  white-space: nowrap;
}

.boton-restablecer:hover {
  border-color: var(--blanco-humo);
  color: var(--blanco-humo);
}

.tabla-contenedor {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

/* ----------------------------------------------------------
   Cabecera en dos niveles: fila de grupo (criterios) y fila
   de etiquetas. Cada nivel con su propio fondo para que se
   distinga de las filas de datos.
   ---------------------------------------------------------- */
thead th {
  font-family: var(--fuente-display);
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--gris-acero);
  padding: 10px 12px;
  text-align: left;
}

.fila-grupo th {
  background: var(--gris-panel);
  border-bottom: 1px solid var(--negro-carbon);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.col-titulo-criterios {
  text-align: center;
}

.grupo-detalle {
  display: block;
  font-family: var(--fuente-datos);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: none;
  color: var(--gris-acero);
  margin-top: 2px;
}

.fila-etiquetas th {
  background: var(--negro-carbon);
  color: var(--blanco-humo);
  white-space: normal;
  min-width: 118px;
}

.criterio-etiqueta {
  display: block;
  font-size: 13px;
  letter-spacing: 0.03em;
}

.criterio-unidad {
  display: block;
  font-family: var(--fuente-datos);
  font-size: 11px;
  font-weight: 400;
  color: var(--gris-acero);
  margin-top: 2px;
}

/* ----------------------------------------------------------
   Rejilla de la matriz: separadores de columna sutiles.
   "Pos.", "Estrategia" y "Calificacion SAW" son bloques
   distintos; los criterios comparten el bloque central.
   ---------------------------------------------------------- */
.col-estrategia {
  min-width: 210px;
  white-space: normal;
}

.col-posicion {
  text-align: center;
  width: 70px;
  border-right: 1px solid var(--gris-panel);
  white-space: nowrap;
}

.col-titulo-criterios,
.col-criterio,
.col-valor,
.col-puntuacion {
  border-left: 1px solid var(--gris-panel);
}

.col-puntuacion {
  text-align: right;
  white-space: nowrap;
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid var(--gris-panel);
}

tbody tr:hover {
  background: rgba(237, 237, 238, 0.03);
}

/* ----------------------------------------------------------
   Celda de estrategia: identificador (A1, A2...), nombre y
   los iconos de los compuestos.
   ---------------------------------------------------------- */
.estrategia-encabezado {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.estrategia-id {
  font-family: var(--fuente-datos);
  font-size: 11px;
  color: var(--gris-acero);
  border: 1px solid var(--gris-panel);
  padding: 1px 6px;
  white-space: nowrap;
}

.estrategia-nombre {
  font-family: var(--fuente-display);
  font-size: 15px;
  font-weight: 600;
}

.estrategia-llantas {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.icono-llanta {
  width: 20px;
  height: 20px;
}

/* ----------------------------------------------------------
   Valores editables de la matriz: inputs centrados dentro
   de la celda para que la rejilla se vea uniforme.
   ---------------------------------------------------------- */
.numero-posicion {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border-radius: 50%;
  background: var(--gris-panel);
  color: var(--blanco-humo);
  font-family: var(--fuente-display);
  font-size: 15px;
  font-weight: 700;
}

.numero-posicion.primero {
  background: var(--rojo-carrera);
}

.entrada-valor {
  width: 72px;
  height: 32px;
  text-align: center;
  background: var(--negro-carbon);
  border: 1px solid var(--gris-panel);
  color: var(--blanco-humo);
  font-family: var(--fuente-datos);
  font-size: 13px;
  box-sizing: border-box;
}

.entrada-valor:hover {
  border-color: var(--gris-acero);
}

.entrada-valor:focus {
  border-color: var(--rojo-carrera);
  outline: none;
}

.col-puntuacion {
  font-family: var(--fuente-datos);
  font-weight: 700;
  color: var(--blanco-humo);
  letter-spacing: 0.02em;
}
</style>
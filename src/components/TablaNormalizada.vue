<script setup>
// Tabla informativa de los valores normalizados (0 a 1) calculados
// en el ultimo "Calcular ranking". No se puede editar: es solo una
// referencia para entender como quedo cada criterio despues del
// paso de normalizacion del metodo SAW.

defineProps({
  resultados: {
    type: Array,
    required: true,
  },
  criterios: {
    type: Array,
    required: true,
  },
})

// Muestra el valor normalizado con 3 decimales.
function formatoValor(valor) {
  return Number(valor).toFixed(3)
}
</script>

<template>
  <section class="panel">
    <div class="panel-encabezado">
      <div>
        <h2 class="panel-titulo">3. Matriz normalizada</h2>
        <p class="panel-ayuda">
          Valores normalizados entre 0 y 1 usados para el calculo: el 1
          es el mejor valor dentro de su columna. Solo informativo, no se
          puede editar; se actualiza al presionar "Calcular ranking".
        </p>
      </div>
    </div>

    <div class="tabla-contenedor">
      <table>
        <thead>
          <tr>
            <th class="col-posicion">Pos.</th>
            <th class="col-estrategia">Estrategia</th>
            <th v-for="criterio in criterios" :key="criterio.clave" class="col-criterio">
              {{ criterio.etiqueta }}
            </th>
            <th class="col-puntuacion">Calificacion SAW</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resultado in resultados" :key="resultado.id">
            <td class="col-posicion">
              <span
                class="numero-posicion"
                :class="{ primero: resultado.posicion === 1 }"
              >
                {{ resultado.posicion }}
              </span>
            </td>
            <td class="col-estrategia">
              <span class="estrategia-id">{{ resultado.id }}</span>
              <span class="estrategia-nombre">{{ resultado.nombre }}</span>
            </td>
            <td v-for="criterio in criterios" :key="criterio.clave" class="col-valor">
              <span
                class="valor-normalizado"
                :class="{ mejor: resultado.normalizado[criterio.clave] === 1 }"
              >
                {{ formatoValor(resultado.normalizado[criterio.clave]) }}
              </span>
            </td>
            <td class="col-puntuacion">{{ resultado.puntuacion.toFixed(4) }}</td>
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

.tabla-contenedor {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead th {
  background: var(--gris-panel);
  font-family: var(--fuente-display);
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--gris-acero);
  padding: 10px 12px;
  text-align: left;
  white-space: nowrap;
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid var(--gris-panel);
  white-space: nowrap;
}

tbody tr:hover {
  background: rgba(237, 237, 238, 0.03);
}

.col-posicion {
  text-align: center;
  width: 70px;
  border-right: 1px solid var(--gris-panel);
}

.col-estrategia {
  min-width: 200px;
  white-space: normal;
}

.col-criterio,
.col-valor {
  border-left: 1px solid var(--gris-panel);
}

.col-valor {
  text-align: center;
  font-family: var(--fuente-datos);
  color: var(--blanco-humo);
}

.col-puntuacion {
  text-align: right;
  border-left: 1px solid var(--gris-panel);
  font-family: var(--fuente-datos);
  font-weight: 700;
  color: var(--blanco-humo);
  letter-spacing: 0.02em;
}

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

.estrategia-id {
  font-family: var(--fuente-datos);
  font-size: 11px;
  color: var(--gris-acero);
  border: 1px solid var(--gris-panel);
  padding: 1px 6px;
  margin-right: 8px;
  white-space: nowrap;
}

.estrategia-nombre {
  font-family: var(--fuente-display);
  font-size: 15px;
  font-weight: 600;
}

.valor-normalizado {
  font-family: var(--fuente-datos);
  color: var(--blanco-humo);
}

.valor-normalizado.mejor {
  color: var(--rojo-carrera);
  font-weight: 700;
}
</style>
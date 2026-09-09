<script setup>
// Este componente solo se encarga de pedir un peso (numero) por
// cada criterio y avisarle al componente padre (App.vue) cuando
// el usuario quiere calcular el ranking o invertir el orden.
// No hace ningun calculo de SAW aqui, eso vive en saw-calculo.js.

defineProps({
  criterios: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['calcular', 'invertir-orden'])
</script>

<template>
  <section class="panel">
    <h2 class="panel-titulo">1. Pesos de los criterios</h2>
    <p class="panel-ayuda">
      Asigna la importancia de cada criterio. No es necesario que sumen 1,
      la aplicacion los reescala automaticamente.
    </p>

    <div class="rejilla-pesos">
      <label v-for="criterio in criterios" :key="criterio.clave" class="campo-peso">
        <span class="campo-etiqueta">{{ criterio.etiqueta }}</span>
        <input
          type="number"
          min="0"
          step="0.05"
          v-model.number="criterio.peso"
          placeholder="0.00"
        />
      </label>
    </div>

    <div class="acciones">
      <button class="boton-principal" @click="emit('calcular')">
        Calcular ranking
      </button>
      <button class="boton-secundario" @click="emit('invertir-orden')">
        Invertir orden
      </button>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: var(--gris-asfalto);
  border: 1px solid var(--gris-panel);
  padding: 24px;
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
  margin: 0 0 20px;
  max-width: 60ch;
}

.rejilla-pesos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 20px;
}

.campo-peso {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo-etiqueta {
  font-family: var(--fuente-display);
  font-size: 14px;
  color: var(--blanco-humo);
}

.campo-peso input {
  background: var(--negro-carbon);
  border: 1px solid var(--gris-panel);
  color: var(--blanco-humo);
  font-family: var(--fuente-datos);
  font-size: 15px;
  padding: 9px 10px;
  width: 100%;
}

.campo-peso input:focus {
  border-color: var(--rojo-carrera);
}

.acciones {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.boton-principal,
.boton-secundario {
  border: none;
  padding: 12px 22px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.boton-principal {
  background: var(--rojo-carrera);
  color: var(--blanco-humo);
}

.boton-principal:hover {
  background: #ff1a12;
}

.boton-secundario {
  background: transparent;
  color: var(--blanco-humo);
  border: 1px solid var(--gris-acero);
}

.boton-secundario:hover {
  border-color: var(--blanco-humo);
}

@media (max-width: 560px) {
  .rejilla-pesos {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
import { computed, reactive, ref } from 'vue'
import FormularioPesos from './components/FormularioPesos.vue'
import TablaResultados from './components/TablaResultados.vue'
import TablaNormalizada from './components/TablaNormalizada.vue'
import { alternativas as alternativasOriginales, criteriosBase } from './data/alternativas.js'
import { calcularSAW } from './saw-calculo.js'
import PantallaCarga from './components/PantallaCarga.vue'
import logoF1 from './assets/logof1.png'
import gifCheco from './assets/checo.gif'
import gifPinguino from './assets/pinguinof1.gif'

// Los criterios se guardan en una variable reactiva porque el
// usuario va a escribir el peso de cada uno en el formulario.
// Empiezan en 0 (sin pesos asignados todavia).
const criterios = reactive(
  criteriosBase.map((criterio) => ({ ...criterio, peso: 0 }))
)

// Copia de trabajo de la matriz de decision.
// -------------------------------------------------------------
// "alternativasOriginales" (el archivo data/alternativas.js) nunca
// se toca: se usa solo como respaldo para el boton "Restablecer".
// "alternativasEditables" es una copia reactiva de esos mismos
// datos, y es la que el usuario puede modificar libremente en la
// tabla para "jugar" con los numeros antes de normalizar.
function copiarAlternativas() {
  return JSON.parse(JSON.stringify(alternativasOriginales))
}

const alternativasEditables = reactive(copiarAlternativas())

// Guarda en que orden (por id) quedaron las alternativas despues
// de la ultima vez que se calculo el ranking.
const ordenActual = ref([])
const calculado = ref(false)

// Muestra la pantalla de carga (gif de Kimi) mientras dura el
// "calculo" antes de que salga el ranking.
const cargando = ref(false)
let temporizadorCarga = null

// Valores normalizados (0 a 1) del ultimo calculo, solo para
// mostrarlos como referencia informativa en la tabla normalizada.
const normalizados = ref([])

// Las filas que se le pasan a la tabla:
//   - Si aun no se ha calculado: la matriz tal cual esta, en su
//     orden original, para que el usuario la edite libremente.
//   - Si ya se calculo: las mismas alternativas (siguen siendo los
//     mismos objetos reactivos, por eso se pueden seguir editando),
//     pero acomodadas segun "ordenActual".
const filas = computed(() => {
  if (!calculado.value) {
    return alternativasEditables
  }
  return ordenActual.value.map(
    (id) => alternativasEditables.find((alternativa) => alternativa.id === id)
  )
})

function calcular() {
  // Si ya hay un calculo en curso se ignora el clic para no
  // amontonar temporizadores.
  if (cargando.value) return

  cargando.value = true
  temporizadorCarga = setTimeout(() => {
    ejecutarCalculo()
    cargando.value = false
  }, 2000)
}

function ejecutarCalculo() {
  const resultados = calcularSAW(alternativasEditables, criterios)

  // calcularSAW no modifica las alternativas originales, devuelve
  // copias nuevas con "puntuacion" y "posicion" ya calculados.
  // Aqui se toman esos dos datos y se pegan de vuelta en los
  // objetos reactivos originales, para no perder la capacidad de
  // seguir editandolos despues de calcular.
  resultados.forEach((resultado) => {
    const fuente = alternativasEditables.find((alternativa) => alternativa.id === resultado.id)
    fuente.puntuacion = resultado.puntuacion
    fuente.posicion = resultado.posicion
  })

  // Se guardan los valores normalizados del ultimo calculo para
  // mostrarlos en la tabla informativa, en el mismo orden del ranking.
  normalizados.value = resultados.map((resultado) => ({
    id: resultado.id,
    nombre: resultado.nombre,
    posicion: resultado.posicion,
    normalizado: resultado.normalizado,
    puntuacion: resultado.puntuacion,
  }))

  ordenActual.value = resultados.map((resultado) => resultado.id)
  calculado.value = true
}

function invertirOrden() {
  // Simplemente se voltea el orden que ya esta en pantalla.
  // Si aun no se ha calculado, no hay nada que invertir.
  if (!calculado.value) return
  ordenActual.value = [...ordenActual.value].reverse()
}

function restablecerValores() {
  // Regresa la matriz de decision a los valores originales de la
  // Tarea 3, borrando cualquier cambio que haya hecho el usuario.
  const originales = copiarAlternativas()

  alternativasEditables.forEach((alternativa) => {
    const original = originales.find((item) => item.id === alternativa.id)
    Object.assign(alternativa.valores, original.valores)
    delete alternativa.puntuacion
    delete alternativa.posicion
  })

  ordenActual.value = []
  normalizados.value = []
  calculado.value = false
}
</script>

<template>
  <div class="franja-carrera"></div>

  <header class="cabecera">
    <img :src="logoF1" alt="Logo de la aplicacion" class="logo" />
    <div class="cabecera-texto">
      <h1>Estrategia SAW</h1>
      <p>Sistema de apoyo a la decision multicriterio - Estrategias de neumaticos</p>
    </div>
  </header>

  <main class="contenido">
    <FormularioPesos :criterios="criterios" @calcular="calcular" @invertir-orden="invertirOrden" />

    <TablaResultados
      :alternativas="filas"
      :criterios="criterios"
      :calculado="calculado"
      @restablecer="restablecerValores"
    />

    <TablaNormalizada
      v-if="calculado"
      :resultados="normalizados"
      :criterios="criterios"
    />

    <section class="gifs-diversion" aria-label="Gifs divertidos">
      <figure class="gif-tarjeta">
        <img :src="gifCheco" alt="Checo" class="gif-imagen" />
        <figcaption class="gif-leyenda">Checo</figcaption>
      </figure>
      <figure class="gif-tarjeta">
        <img :src="gifPinguino" alt="Pinguino F1" class="gif-imagen" />
        <figcaption class="gif-leyenda">Pinguino F1</figcaption>
      </figure>
    </section>
  </main>

  <div class="franja-carrera"></div>

  <PantallaCarga v-if="cargando" />
</template>

<style scoped>
.cabecera {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px 32px;
  border-bottom: 1px solid var(--gris-panel);
}

.logo {
  height: 48px;
  width: auto;
}

.cabecera-texto h1 {
  font-family: var(--fuente-display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0;
}

.cabecera-texto p {
  margin: 2px 0 0;
  color: var(--gris-acero);
  font-size: 13px;
}

.contenido {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px 32px 64px;
}

.gifs-diversion {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.gif-tarjeta {
  margin: 0;
  text-align: center;
}

.gif-imagen {
  width: 160px;
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid var(--gris-panel);
  display: block;
}

.gif-leyenda {
  font-family: var(--fuente-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--gris-acero);
  margin-top: 8px;
}

@media (max-width: 640px) {
  .cabecera {
    padding: 20px;
  }

  .contenido {
    padding: 20px 20px 48px;
  }
}
</style>

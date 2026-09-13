<script setup>
// Pantalla de carga que se muestra mientras se "calcula" el ranking.
// Sale el gif de Kimi con una leyenda que dice "calculando..." y
// un logo de carga girando, para darle un toque divertido al boton.

import gifKimi from '../assets/kimi.gif'
import logoF1 from '../assets/logof1.png'
</script>

<template>
  <div class="pantalla-carga" role="status" aria-live="polite">
    <div class="tarjeta-carga">
      <img :src="gifKimi" alt="Kimi calculando" class="gif-kimi" />

      <p class="texto-carga">
        calculando<span class="punto">.</span><span class="punto">.</span><span class="punto">.</span>
      </p>

      <div class="logo-carga" aria-label="Cargando">
        <img :src="logoF1" alt="" class="logo-carga-imagen" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pantalla-carga {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(11, 12, 14, 0.88);
}

.tarjeta-carga {
  background: var(--gris-asfalto);
  border: 1px solid var(--gris-panel);
  box-shadow: 0 0 50px rgba(225, 6, 0, 0.28);
  padding: 28px 40px 32px;
  max-width: 90vw;
  text-align: center;
}

.gif-kimi {
  display: block;
  width: 240px;
  max-width: 100%;
  border-radius: 6px;
  margin: 0 auto;
}

.texto-carga {
  font-family: var(--fuente-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.03em;
  margin: 18px 0 0;
}

.punto {
  opacity: 0.15;
  animation: parpadeo 1.2s infinite;
}

.punto:nth-child(2) {
  animation-delay: 0.2s;
}

.punto:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes parpadeo {
  0%,
  60%,
  100% {
    opacity: 0.15;
  }
  30% {
    opacity: 1;
  }
}

.logo-carga {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-top: 18px;
  border: 3px solid var(--gris-panel);
  border-top-color: var(--rojo-carrera);
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

.logo-carga-imagen {
  width: 32px;
  height: 32px;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
</style>
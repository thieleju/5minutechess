<script setup>
// testing client only
import { loadFull } from "tsparticles";

const particlesInit = async (engine) => {
  await loadFull(engine);
};

const options = computed(() => {
  return {
    background: {
      color: {
        value: "#161618",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "attract",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
      },
      modes: {
        push: {
          quantity: 1,
        },
        attract: {
          distance: 100,
          duration: 2,
          speed: 0.5,
          factor: 1,
        },
      },
    },
    particles: {
      number: {
        value: 160,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
        image: {
          src: "img/github.svg",
          width: 100,
          height: 100,
        },
      },
      opacity: {
        value: 1,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 4,
          size_min: 0.3,
          sync: false,
        },
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 600,
        },
      },
    },
    detectRetina: true,
  };
});

onMounted(() => {
  // code here
});
</script>

<template>
  <particles
    id="tsparticles"
    :particlesInit="particlesInit"
    :options="options"
  />
</template>

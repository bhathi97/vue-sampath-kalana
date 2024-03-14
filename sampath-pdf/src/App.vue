<template>
  <main-window></main-window>
</template>

<script>
import mainWindow from './components/Main-Window.vue'

export default {
  name: 'App',
  components: {
    mainWindow
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@font-face {
  font-family: "Metropolis-Regular" ;
  src: url(../src/assets/fonts/Metropolis-Regular.otf);
}

@font-face {
  font-family: "Metropolis-Bold" ;
  src: url(../src/assets/fonts/Metropolis-Bold.otf);
}

/* @font-face {
  font-family: "Gotham-Bold";
  src: url(../src/assets/fonts/Gotham-Bold.otf);
} */

</style>

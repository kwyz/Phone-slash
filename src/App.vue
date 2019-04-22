<template>
  <div id="app" class="h-100">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    window.screen.orientation.lock('landscape-primary')
  }
}
</script>

<style>
html,
body{
  width: 100%;
  height: 100%;
}
</style>

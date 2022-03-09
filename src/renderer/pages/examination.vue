<template>
  <div>
  </div>
</template>

<script>
export default {
  created(){
       this.$store.dispatch("GetUserInfo")
  }
}
</script>

<style>

</style>
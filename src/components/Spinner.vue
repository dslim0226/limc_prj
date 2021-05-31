<template>
  <div class="spinner">
    <md-progress-spinner
      class="md-accent"
      :md-stroke="3"
      md-mode="indeterminate"
    />
  </div>
</template>

<script>
export default {
};
</script>

<style scoped>
.spinner{
  display: flex;
  justify-content: center;
}
</style>

<template>
  <md-toolbar
    md-elevation="0"
    class="md-transparent"
    :class="{
      'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute
    }"
  >
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-round md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
export default {
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    }
  }
};
</script>

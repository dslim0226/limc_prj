<template>
  <component :is="'li'" tag="li">
    <a
      class="nav-link sidebar-menu-item"
      data-toggle="collapse"
      @click="open = true"
    >
      <md-icon>{{ link.icon }}</md-icon>
      <p>
        {{ link.name }}
      </p>
    </a>
    <my-info-modal @close="close" :open="open" />
  </component>
</template>
<script>

import MyInfoModal from "@/pages/Dashboard/Forms/MyInfoModal";
export default {
  name: "open-modal-sidebar-item",
  components: { MyInfoModal },
  props: {
    link: {
      type: Object,
      default: () => {
        return {
          name: "",
          children: [],
          open: false
        };
      }
    }
  },
  provide() {
    return {
      addLink: this.addChild,
      removeLink: this.removeChild
    };
  },
  inject: {
    addLink: { default: null },
    removeLink: { default: null },
    autoClose: {
      default: true
    }
  },
  data() {
    return {
      children: [],
      open: false,
    };
  },
  computed: {
    baseComponent() {
      return this.isMenu || this.link.isRoute ? "li" : "router-link";
    },
    linkPrefix() {
      if (this.link.name) {
        let words = this.link.name.split(" ");
        return words.map(word => word.substring(0, 1)).join("");
      }
      return false;
    },
    isMenu() {
      return this.children.length > 0 || this.menu === true;
    },
    isActive() {
      if (this.$route && this.$route.path) {
        let matchingRoute = this.children.find(c =>
          this.$route.path.startsWith(c.link.path)
        );
        if (matchingRoute !== undefined) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    close() {
      this.open = false;
    }
  }
};
</script>
<style>
.sidebar-menu-item {
  cursor: pointer;
}
</style>

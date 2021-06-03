<template>
  <component :is="'li'" tag="li">
    <a
      class="nav-link sidebar-menu-item"
      data-toggle="collapse"
      @click="logout"
    >
      <md-icon>{{ link.icon }}</md-icon>
      <p>
        {{ link.name }}
      </p>
    </a>
  </component>
</template>
<script>
import Swal from "sweetalert2";

export default {
  name: "logout-sidebar-item",
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
      open: false
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
    logout() {
      Swal.fire({
        title: "로그아웃 하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: `로그아웃`,
        cancelButtonText: `취소`
      }).then(result => {
        if (result) {
          this.$store.dispatch("login/initData");
          this.$router.push("/login");
        }
      });
    }
  }
};
</script>
<style>
.sidebar-menu-item {
  cursor: pointer;
}
</style>

<template>
  <div class="wrapper" :class="[{ 'nav-open': $sidebar.showSidebar }]">
    <notifications></notifications>
    <side-bar
      :active-color="sidebarBackground"
      :data-background-color="sidebarBackgroundColor"
    >
      <template slot="links">
        <sidebar-item
          :link="{ name: '내 정보', icon: 'person', path: '/info' }"
        />
        <sidebar-item
          v-if="isChiefAdmin || isMiddleAdmin"
          :link="{ name: '회원목록', icon: 'groups', path: '/list/user' }"
        />
        <sidebar-item
          :link="{ name: '계약목록', icon: 'grid_on', path: '/list/contract' }"
        />
        <logout-sidebar-item
          :link="{ name: '로그아웃', icon: 'logout'}"
        />
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <div
        :class="{ content: !$route.meta.hideContent }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
    document.getElementsByClassName(className)[0].scrollTop = 0;
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

function reinitScrollbar() {
  let docClasses = document.body.classList;
  let isWindows = navigator.platform.startsWith("Win");
  if (isWindows) {
    // if we are on windows OS we activate the perfectScrollbar function
    initScrollbar("sidebar");
    initScrollbar("sidebar-wrapper");
    initScrollbar("main-panel");

    docClasses.add("perfect-scrollbar-on");
  } else {
    docClasses.add("perfect-scrollbar-off");
  }
}

import TopNavbar from "./TopNavbar.vue";
import { ZoomCenterTransition } from "vue2-transitions";
import LogoutSidebarItem from "@/components/SidebarPlugin/LogoutSideBarItem";
import AuthLayout from "@/pages/Layout/AuthLayout";
import AuthorityMixin from "@/mixin/AuthorityMixin";

export default {
  components: {
    LogoutSidebarItem,
    TopNavbar,
    ZoomCenterTransition
  },
  mixins: [AuthorityMixin],
  data() {
    return {
      sidebarBackgroundColor: "black",
      sidebarBackground: "green",
      sidebarBackgroundImage: "./img/sidebar-2.jpg",
      sidebarMini: true,
      sidebarImg: true
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    }
  },
  updated() {
    reinitScrollbar();
  },
  mounted() {
    reinitScrollbar();
  },
  watch: {
    sidebarMini() {
      this.minimizeSidebar();
    }
  }
};
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}

.wrapper {
  overflow-x: hidden;
}

/* kokimin css 작업 */
body,
h1,
h2,
h3,
h4,
h5,
h6,
.h1,
.h2,
.h3,
.h4 {
  font-family: "Nanum Gothic", "Roboto", "Helvetica", "Arial", sans-serif;
}
.table-header-button {
  position: absolute;
  right: 20px;
  top: -10px;
}
.search-top {
  margin-top: 0px;
}
.modal-contract .modal-container {
  max-width: 50%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-user .modal-container {
  max-width: 40%;
  padding: 0% 1%;
}

@media screen and (max-width: 992px) {
  .search-top {
    margin-top: 20px !important;
  }
  .modal-contract .modal-container {
    max-width: 90%;
    max-height: 70vh;
    overflow-y: auto;
  }
  .modal-user .modal-container {
    max-width: 90%;
    padding: 0%;
  }
}
</style>

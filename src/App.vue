<template>
  <router-view v-if="$store.getters['login/isLogin']"></router-view>
  <AuthLayout v-else />
</template>

<script>
import AuthLayout from "@/pages/Layout/AuthLayout";

export default {
  components: { AuthLayout }
}
</script>

<template>
  <div class="md-layout text-center">
    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
    >
      <login-card header-color="green">
        <h4 slot="title" class="title">Login</h4>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>person</md-icon>
          <label>아이디</label>
          <md-input v-model="id"></md-input>
        </md-field>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>lock_outline</md-icon>
          <label>비밀번호</label>
          <md-input type="password" v-model="password"></md-input>
        </md-field>
        <md-button @click="login" slot="footer" class="md-simple md-success md-lg">
          로그인
        </md-button>
      </login-card>
    </div>
  </div>
</template>
<script>
import { LoginCard } from "@/components";
export default {
  components: {
    LoginCard
  },
  data() {
    return {
      id: null,
      password: null
    };
  },
  methods: {
    login() {
      this.$router.push({ path: "/list/user" });
    }
  }
};
</script>

<style></style>

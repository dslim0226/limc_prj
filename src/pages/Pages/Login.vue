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
          <md-input v-model="loginId" @keypress.enter="loginBtn" />
        </md-field>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>lock_outline</md-icon>
          <label>비밀번호</label>
          <md-input
            type="password"
            v-model="password"
            @keypress.enter="loginBtn"
          />
        </md-field>
        <md-button
          :disabled="!hasLoginData"
          @click="loginBtn"
          slot="footer"
          class="md-simple md-success md-lg"
        >
          로그인
        </md-button>
      </login-card>
    </div>
  </div>
</template>
<script>
import { LoginCard } from "@/components";
import { axiosInstance } from "@/axiosModule";
import { mapActions, mapGetters } from "vuex";
import AlertMixin from "@/mixin/AlertMixin";

export default {
  components: {
    LoginCard
  },
  mixins: [AlertMixin],
  created() {
    if (this.isLogin) {
      this.$router.push("/").catch(() => {});
    }
  },
  computed: {
    ...mapGetters("login", ["isLogin"]),
    hasLoginData() {
      return (
        /^[A-Za-z0-9!~@#$%^&*()?+=\/]{4,}$/.test(this.loginId) &&
        this.password.length > 3
      );
    }
  },
  data() {
    return {
      loginId: "",
      password: ""
    };
  },
  methods: {
    ...mapActions("login", ["memberInfo"]),
    async loginBtn() {
      if(!this.hasLoginData) return;
      try {
        const { data } = await axiosInstance.get("/api/login.php", {
          params: {
            user_id: this.loginId,
            user_pw: this.password
          }
        });

        if (data.result === "200") {
          this.memberInfo(data["data"]).then(() => {
            this.$router.push("/").catch(() => {});
          });
        }
      } catch (e) {
        this.showAlert(
          "error",
          "로그인 실패",
          "아이디 및 비밀번호가 올바르지 않습니다.",
          () => {}
        );
      }
    }
  }
};
</script>

<style></style>

<template>
  <div class="md-layout md-alignment-center-center">
    <div class="md-layout-item md-size-40 md-small-size-100">
      <md-card>
        <md-card-header class="md-card-header-text md-card-header-green">
          <div class="card-text">
            <h4 class="title text-bold">내 정보</h4>
          </div>
        </md-card-header>

        <md-card-content v-if="loading">
          <spinner />
        </md-card-content>
        <md-card-content v-else>
          <div class="md-layout">
            <md-field>
              <label>아이디</label>
              <md-input v-model="user.user_id" :disabled="true" />
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호</label>
              <md-input v-model="user.password" type="password" />
              <span class="md-helper-text">비밀번호를 수정할 경우에만 적어주세요.</span>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호 확인</label>
              <md-input v-model="user.password2" type="password" />
              <span class="md-helper-text">위와 같은 비밀번호를 적어주세요.</span>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>이름</label>
              <md-input v-model="user.user_nm" />
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>연락처</label>
              <md-input v-model="user.user_hp" />
            </md-field>
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button
            class="md-success md-dense"
            @click="modify"
            :disabled="!validateModify"
            >수정</md-button
          >
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>
<script>
import { axiosInstance } from "@/axiosModule";
import Spinner from "@/components/Spinner";
import AlertMixin from "@/mixin/AlertMixin";
import { mapGetters } from "vuex";

export default {
  components: { Spinner },
  props: {
    item: {
      type: Object
    }
  },
  mixins: [AlertMixin],
  computed: {
    ...mapGetters("login", ["userId", "userLevel"]),
    checkPassword() {
      const pw = this.user.password;
      const pw2 = this.user.password2;
      return pw.length > 3 && pw === pw2;
    },
    isChangeData() {
      return (
        this.backup.user_nm !== this.user.user_nm || this.backup.user_hp !== this.user.user_hp
      );
    },
    validateModify() {
      return this.checkPassword || this.isChangeData;
    }
  },
  async created() {
    await this.getInfo();
  },
  data: () => ({
    backup: {
      user_nm: "",
      user_hp: ""
    },
    user: {
      user_id: "",
      user_nm: "",
      user_hp: "",
      user_pw: "",
      user_level_nm: "",
      user_level: "",
      parent_user_nm: "",
      parent_user: "",
      password: "",
      password2: ""
    },
    loading: false,
    modifyText: {
      title: `내 정보 수정 완료`,
      text: "내 정보 수정이 완료되었습니다."
    }
  }),
  methods: {
    async getInfo() {
      this.loading = true;
      try {
        const { data } = await axiosInstance.get("/api/sy_user_info.php", {
          params: {
            user_id: this.userId
          }
        });
        this.user = { ...this.user, ...data["data"] };
        this.backup.user_nm = data["data"]["user_nm"];
        this.backup.user_hp = data["data"]["user_hp"];
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async modify() {
      let body = {
        mode: "EDIT",
        login_level: this.userLevel,
        login_id: this.userId,
        ...this.user
      };
      body["user_pw"] =
        this.checkPassword && this.user.user_pw !== this.user.password
          ? this.user.password
          : this.user.user_pw;

      try {
        await axiosInstance.post("/api/sy_user_action.php", body);

        this.showAlert(
          "success",
          "수정 성공",
          "회원 정보가 수정되었습니다!",
          () => {this.getInfo()}
        );
      } catch (e) {
        this.showAlert(
          "error",
          "수정 실패",
          "회원 정보 수정 중 오류가 발생했습니다.",
          () => {}
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.md-card .md-card-actions {
  border: none;
}

.md-inline-checkboxes {
  display: inline-flex;

  .md-checkbox {
    margin-top: 15px !important;
  }
}

.md-checkbox,
.md-radio {
  margin-top: 15px;
  margin-bottom: 0.5rem;
}

.md-checkbox,
.md-radio {
  display: flex;
}

.md-radio .md-radio-container {
  margin-left: 5px;
  position: relative;
  left: -3px;
}

.md-form-label + .md-layout-item .md-checkbox:not(:first-child),
.md-form-label + .md-layout-item + .md-layout-item .md-radio:not(:first-child),
.md-form-label + .md-layout-item .md-radio {
  margin-top: 0;
}

.form-control-static {
  margin-top: 6px;
}

.text-bold {
  font-weight: 500 !important;
}

.not-modify {
  display: flex;
  align-items: flex-end;
}

.not-modify span {
  font-weight: 400;
}
.md-small-size-100 {
  text-align: left !important;
}
</style>

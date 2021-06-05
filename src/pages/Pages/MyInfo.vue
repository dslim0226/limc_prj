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
              <md-input v-model="user.loginId" :disabled="true" />
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호</label>
              <md-input v-model="user.password" type="password" />
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호 확인</label>
              <md-input v-model="user.password2" type="password" />
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>이름</label>
              <md-input v-model="user.name" />
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>연락처</label>
              <md-input v-model="user.tel" />
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>가입일</label>
              <md-input v-model="user.createDate" :disabled="true" />
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

export default {
  components: { Spinner },
  props: {
    item: {
      type: Object
    }
  },
  mixins: [AlertMixin],
  computed: {
    checkPassword() {
      const pw = this.user.password;
      const pw2 = this.user.password2;
      return pw.length > 3 && pw === pw2;
    },
    isChangeData() {
      return (
        this.backup.name !== this.user.name || this.backup.tel !== this.user.tel
      );
    },
    validateModify() {
      return this.checkPassword || this.isChangeData;
    }
  },
  async created() {
    this.loading = true;

    try {
      const { data } = await axiosInstance.get(
        "https://my-json-server.typicode.com/dslim0226/test-json/user/1"
      );
      this.user = { ...this.user, ...data };
      this.backup.name = data.name;
      this.backup.tel = data.tel;
    } catch (e) {
      console.log(e);
    }

    this.loading = false;
  },
  data: () => ({
    backup: {
      name: "",
      tel: ""
    },
    user: {
      userId: "",
      loginId: "",
      name: "",
      password: "",
      password2: "",
      userLevel: "",
      tel: "",
      parentAdmin: "",
      createDate: ""
    },
    loading: false,
    modifyText: {
      title: `내 정보 수정 완료`,
      text: "내 정보 수정이 완료되었습니다."
    }
  }),
  methods: {
    async modify() {
      let body = {
        userId: this.user.userId,
        name: this.user.name,
        tel: this.user.tel
      };

      if (this.checkPassword) {
        body.password = this.password;
      }

      try {
        // const { data } = await axiosInstance.put("/private/User", body);

        this.showAlert(
          "success",
          "수정 성공",
          "회원 정보가 수정되었습니다!",
          () => {}
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

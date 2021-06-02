<template>
  <modal v-if="open" @close="$emit('close')" class="modal-user">
    <template slot="header">
      <h4 class="modal-title">회원 정보 {{ isSaveMode ? "등록" : "수정" }}</h4>
    </template>

    <template slot="body" v-if="loading">
      <spinner />
    </template>
    <template slot="body" v-else>
      <div class="md-layout">
        <md-field>
          <label>아이디</label>
          <md-input
            v-model="user.loginId"
            type="text"
            :disabled="!isSaveMode"
          />
          <md-button
            v-if="isSaveMode"
            class="md-primary md-dense md-button-pc"
            :disabled="isIdCheck"
            @click="check"
          >
            <span>중복 검사</span>
          </md-button>
        </md-field>
      </div>
      <md-button
        v-if="isSaveMode"
        class="md-primary md-dense md-layout md-button-mobile"
        :disalbed="isIdCheck"
        @click="check"
      >
        <span>중복 검사</span>
      </md-button>

      <div class="md-layout" v-if="isSaveMode">
        <md-field>
          <label>비밀번호</label>
          <md-input v-model="user.password" type="password"></md-input>
        </md-field>
      </div>

      <div class="md-layout" v-if="isSaveMode">
        <md-field>
          <label>비밀번호 확인</label>
          <md-input v-model="user.password2" type="password"></md-input>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>이름</label>
          <md-input v-model="user.name" type="text"></md-input>
        </md-field>
      </div>

      <div class="md-layout" v-if="isChiefAdmin">
        <md-field>
          <label>권한</label>
          <md-select v-model="user.authority" :disabled="!isSaveMode">
            <md-option :value="userRole.MIDDLE_ADMIN">중간관리자</md-option>
            <md-option :value="userRole.GENERAL_USER">일반관리자</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout" v-if="isChiefAdmin && checkMiddleAdminInForm">
        <md-field>
          <label>담당자</label>
          <md-select
            v-model="user.parentAdmin"
            name="movie"
            id="movie"
            :disabled="!isSaveMode"
          >
            <md-option value="0">임대성</md-option>
            <md-option value="1">강찬수</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>연락처</label>
          <md-input v-model="user.tel" type="text"></md-input>
        </md-field>
      </div>

      <div class="md-layout" v-if="!isSaveMode">
        <md-field>
          <label>가입일</label>
          <md-input :value="user.createDate" type="text" :disabled="true" />
        </md-field>
      </div>
    </template>

    <template slot="footer">
      <md-card-actions md-alignment="space-between">
        <div>
          <md-button @click="close" class="md-default md-dense">
            닫기
          </md-button>
        </div>
        <div>
          <md-button
            :disabled="!validateCreate"
            class="md-success md-dense"
            v-if="isSaveMode"
          >생성
          </md-button>
          <md-button
            :disabled="!isChangeData"
            @click="updateUser"
            class="md-success md-dense"
            v-else-if="!isSaveMode"
          >수정
          </md-button>
        </div>
      </md-card-actions>
    </template>
  </modal>
</template>

<script>
import * as userRole from "@/role";
import Modal from "@/components/Modal";
import axios from "axios";
import Spinner from "@/components/Spinner";
import AuthorityMixin from "@/mixin/AuthorityMixin";
import AlertMixin from "@/mixin/AlertMixin";

export default {
  async created() {
    // const { data } = await axios.get("/private/user/authorities");
    // this.parentAdminList = data.map(x => `${x.name}(${x.loginId})`);
  },
  components: { Spinner, Modal },
  mixins: [AuthorityMixin, AlertMixin],
  props: {
    id: {
      type: Number
    },
    open: {
      type: Boolean
    }
  },
  computed: {
    isSaveMode() {
      return this.id === -1;
    },
    isChangeData() {
      return (
        this.backup.name !== this.user.name || this.backup.tel !== this.user.tel
      );
    },
    checkMiddleAdminInForm() {
      return this.user.role === userRole.MIDDLE_ADMIN;
    },
    isIdCheck() {
      return this.idCheck || this.user.loginId.length < 1;
    },
    checkPassword() {
      const pw = this.user.password;
      const pw2 = this.user.password2;
      return pw.length > 3 && pw === pw2;
    },
    checkName() {
      return this.user.name.length > 0;
    },
    checkTel() {
      return this.user.tel.length > 0;
    },
    validateCreate() {
      let check = true;
      if (this.isChiefAdmin) {
        check =
          this.authority.length > 0 &&
          (this.checkMiddleAdminInForm
            ? true
            : this.parentAdminList.length > 0);
      }
      return this.isIdCheck && this.checkPassword && this.checkName && this.checkTel && check;
    }
  },
  watch: {
    id: async function(id) {
      this.init();
      if (id > -1) {
        this.loading = true;

        const { data } = await axios.get(
          `http://my-json-server.typicode.com/dslim0226/test-json/user/${id}`
        );

        this.user = { ...this.user, ...data };
        this.backup.name = data.name;
        this.backup.tel = data.tel;
        this.loading = false;
      } else {
        this.init();
      }
    },
    "user.loginId": function() {
      this.idCheck = false;
    }
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
      authority: "",
      tel: "",
      parentAdmin: "",
      createDate: ""
    },
    parentAdminList: [],
    idCheck: false,
    loading: false
  }),
  methods: {
    close() {
      this.init();
      this.$emit("close");
    },
    async check() {
      // const { data } = await axios.get("/private/User/check", {
      //   params: {
      //     loginId: this.user.loginId
      //   }
      // });
      //
      // this.idCheck = data;

      this.idCheck = true;
    },
    async updateUser() {
      try {
        // const { data } = await axios.put("/private/User", {
        //   userId: this.user.userId,
        //   name: this.user.name,
        //   tel: this.user.tel
        // });

        this.showAlert("success", "수정 성공", "회원 정보가 수정되었습니다!", function() {
            this.close();
          }
        );
      } catch (e) {
        this.showAlert("error", "수정 실패", "회원 정보가 수정 중 오류가 발생했습니다.",()=>{});
      }
    },
    init() {
      this.user = {
        userId: "",
        loginId: "",
        name: "",
        password: "",
        password2: "",
        role: "0",
        tel: "",
        master: "",
        createDate: ""
      };
      this.idCheck = false;
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

.md-button-pc {
  display: block;
}

.md-button-mobile {
  display: none;
}

@media screen and (max-width: 992px) {
  .md-button-pc {
    display: none;
  }
  .md-button-mobile {
    display: block;
  }
}
</style>

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
          <span class="md-helper-text">영문 및 숫자를 포함한 4자리 이상 아이디를 적어주세요.</span>
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
          <span class="md-helper-text">4자리 이상의 비밀번호를 적어주세요.</span>

        </md-field>
      </div>

      <div class="md-layout" v-if="isSaveMode">
        <md-field>
          <label>비밀번호 확인</label>
          <md-input v-model="user.password2" type="password"></md-input>
          <span class="md-helper-text">위와 같은 비밀번호를 적어주세요.</span>
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
          <md-select v-model="user.memberRole" :disabled="!isSaveMode">
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
            :disabled="!isSaveMode"
          >
            <md-option
              v-for="(item, index) in parentAdminList"
              :value="item.userId"
              :key="index"
              >{{ `${item.name}(${item.loginId})` }}</md-option
            >
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
            class="md-success md-dense"
            :disabled="!validateCreate"
            v-if="isSaveMode"
            @click="createUser"
          >생성
          </md-button>
          <md-button
            class="md-success md-dense"
            :disabled="!isChangeData"
            v-else-if="!isSaveMode"
            @click="updateUser"

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
    // 일반관리자 생성 시 중간관리자 목록 리스트
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
      return this.user.memberRole === userRole.GENERAL_USER;
    },
    isIdCheck() {
      return this.idCheck || !/^[!A-Za-z0-9]{4,}$/.test(this.user.loginId);
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
    checkParent() {
      return this.isChiefAdmin && this.checkMiddleAdminInForm && this.user.parentAdmin
    },
    validateCreate() {
      let check = true;
      if (this.isChiefAdmin) {
        check =
          this.memberRole.length > 0 &&
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
    },
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
      memberRole: "",
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
      // const { data } = await axios.get("http://192.168.35.102:8080/private/User/check", {
      //   params: {
      //     loginId: this.user.loginId
      //   }
      // });

      if(data.userId) {
        this.showAlert("error", "중복된 아이디", "중복된 아이디 입니다.");
      } else {
        this.showAlert("success", "사용할 수 있는 아이디", "사용할 수 있는 아이디 입니다.");
      }

      this.idCheck = !data.userId;
    },
    async updateUser() {
      try {
        // const { data } = await axios.put("/private/User", {
        //   userId: this.user.userId,
        //   name: this.user.name,
        //   tel: this.user.tel
        // });

        this.showAlert("success", "수정 완료", "회원 정보가 수정되었습니다!", this.close);
      } catch (e) {
        this.showAlert("error", "수정 실패", "회원 정보 수정 중 오류가 발생했습니다.",()=>{});
      }
    },
    async createUser() {
      const body = {
        loginId: this.user.loginId,
        password: this.user.password,
        userNm: this.user.name,
        userRole: this.user.memberRole,
        userTelNum: this.user.tel.replace(/[^0-9]/gi, "")
      };

      // 최고 관리자가 일반 유저를 생성하는 경우에
      // 부모 관리자를 설정해준다.
      if(this.isChiefAdmin && body.userRole === this.userRole.GENERAL_USER) {
        body["parentAdmin"] = this.user.parentAdmin;
      };

      // 현재 로그인한 사람이 중간 관리자라면
      // 생성할 수 있는 유저 권한은 GENERAL_USER 뿐이고
      // 부모는 자기 자신의 memberId 로 한다.
      if(this.isMiddleAdmin) {
        body["userRole"] = this.userRole.GENERAL_USER;
        body["parentAdmin"] = this.memberId;
      }

      try{
        await axios.post("http://192.168.35.102:8080/private/User", body);
        this.showAlert("success", "생성 완료", "회원 정보가 생성되었습니다.", this.close)
      } catch(e) {
        this.showAlert("error", "생성 실패", "회원 정보 생성 중 오류가 발생했습니다.",()=>{})
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

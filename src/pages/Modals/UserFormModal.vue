<template>
  <modal v-if="open" @close="$emit('close', false)" class="modal-user">
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
            v-model="user.user_id"
            type="text"
            :disabled="!isSaveMode"
          />
          <span class="md-helper-text"
          >영문 및 숫자를 포함한 4자리 이상 아이디를 적어주세요.</span
          >
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
          <span class="md-helper-text"
          >4자리 이상의 비밀번호를 적어주세요.</span
          >
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
          <md-input v-model="user.user_nm" type="text"></md-input>
        </md-field>
      </div>

      <div class="md-layout" v-if="isChiefAdmin">
        <md-field>
          <label>권한</label>
          <md-select v-model="user.user_level" :disabled="!isSaveMode">
            <md-option
              v-for="(item, index) in business_cd"
              :key="index"
              :value="item['code_cd']"
            >
              {{ item["code_nm"] }}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout" v-if="isChiefAdmin && checkMiddleAdminInForm">
        <md-field>
          <label>담당자</label>
          <md-select v-model="user.parent_user" :disabled="!isSaveMode">
            <md-option
              v-for="(item, index) in parentAdminList"
              :value="item.user_id"
              :key="index"
            >{{ `${item.user_nm}(${item.user_id})` }}
            </md-option
            >
          </md-select>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>연락처</label>
          <md-input v-model="user.user_hp" type="text"></md-input>
        </md-field>
      </div>
    </template>

    <template slot="footer">
      <md-card-actions md-alignment="space-between">
        <div>
          <md-button @click="close(false)" class="md-default md-dense">
            닫기
          </md-button>
        </div>
        <div>
          <md-button
            class="md-danger md-dense"
            v-if="!isSaveMode && isChiefAdmin"
            @click="deleteUser"
          >삭제
          </md-button>
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
import { axiosInstance } from "@/axiosModule";
import Spinner from "@/components/Spinner";
import AuthorityMixin from "@/mixin/AuthorityMixin";
import AlertMixin from "@/mixin/AlertMixin";
import Swal from "sweetalert2";

export default {
  async created() {
    if (this.isMiddleAdmin) {
      this.user.user_level = this.userRole.GENERAL_USER;
    }
    // 일반관리자 생성 시 중간관리자 목록 리스트
    const { data } = await axiosInstance.get("/api/parent_user.php");
    this.parentAdminList = data["data"]["rows"];
  },
  components: { Spinner, Modal },
  mixins: [AuthorityMixin, AlertMixin],
  props: {
    id: {
      type: String
    },
    open: {
      type: Boolean
    },
    business_cd: {
      type: Array
    }
  },
  computed: {
    isSaveMode() {
      return this.id === "-1";
    },
    isChangeData() {
      return (
        this.backup.user_nm !== this.user.user_nm ||
        this.backup.user_hp !== this.user.user_hp
      );
    },
    checkMiddleAdminInForm() {
      return this.user.user_level === userRole.GENERAL_USER;
    },
    isIdCheck() {
      return this.idCheck || !/^[!A-Za-z0-9]{4,}$/.test(this.user.user_id);
    },
    checkPassword() {
      const pw = this.user.password;
      const pw2 = this.user.password2;
      return pw.length > 3 && pw === pw2;
    },
    checkName() {
      return this.user.user_nm.length > 0;
    },
    checkTel() {
      return this.user.user_hp.length > 0;
    },
    checkParent() {
      return (
        this.isChiefAdmin &&
        this.checkMiddleAdminInForm &&
        this.user.parent_user
      );
    },
    validateCreate() {
      let check = true;
      if (
        this.isChiefAdmin &&
        this.user.user_level === this.userRole.GENERAL_USER
      ) {
        check = !!this.user.parent_user;
      }

      return (
        this.isIdCheck &&
        this.checkPassword &&
        this.checkName &&
        this.checkTel &&
        check
      );
    }
  },
  watch: {
    id: async function(id) {
      this.init();
      if (!this.isSaveMode) {
        this.loading = true;

        const { data } = await axiosInstance.get(`/api/sy_user_info.php`, {
          params: {
            user_id: id
          }
        });

        this.user = { ...this.user, ...data["data"] };
        this.backup.user_nm = data["data"]["user_nm"];
        this.backup.user_hp = data["data"]["user_hp"];
        this.loading = false;
      } else {
        this.init();
      }
    },
    "user.user_id": function() {
      this.idCheck = false;
    }
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
    parentAdminList: [],
    idCheck: false,
    loading: false
  }),
  methods: {
    close(refresh) {
      this.init();
      this.$emit("close", refresh);
    },
    async check() {
      const { data } = await axiosInstance.get("/api/sy_user_check.php", {
        params: {
          user_id: this.user.user_id
        }
      });

      if (data["data"]) {
        this.showAlert(
          "success",
          "사용할 수 있는 아이디",
          "사용할 수 있는 아이디 입니다."
        );
      } else {
        this.showAlert("error", "중복된 아이디", "중복된 아이디 입니다.");
      }

      this.idCheck = data["data"];
    },
    async updateUser() {
      try {
        const { data } = await axiosInstance.post("/api/sy_user_action.php", {
          mode: "EDIT",
          login_level: this.userLevel,
          login_id: this.userId,
          ...this.user
        });

        this.showAlert(
          "success",
          "수정 완료",
          "회원 정보가 수정되었습니다!",
          this.close(true)
        );
      } catch (e) {
        this.showAlert(
          "error",
          "수정 실패",
          "회원 정보 수정 중 오류가 발생했습니다.",
          () => {
          }
        );
      }
    },
    async createUser() {
      const body = {
        mode: "ADD",
        login_level: this.userLevel,
        login_id: this.userId,
        user_id: this.user.user_id,
        user_pw: this.user.password,
        user_nm: this.user.user_nm,
        user_level: this.user.user_level,
        user_hp: this.user.user_hp,
        parent_user: ""
      };

      // 최고 관리자가 일반 유저를 생성하는 경우에
      // 부모 관리자를 설정해준다.
      if (this.isChiefAdmin && body.user_level === this.userRole.GENERAL_USER) {
        body["parent_user"] = this.user.parent_user;
      }

      // 현재 로그인한 사람이 중간 관리자라면
      // 생성할 수 있는 유저 권한은 GENERAL_USER 뿐이고
      // 부모는 자기 자신의 memberId 로 한다.
      if (this.isMiddleAdmin) {
        body["user_level"] = this.userRole.GENERAL_USER;
        body["parent_user"] = this.userId;
      }

      try {
        await axiosInstance.post("/api/sy_user_action.php", body);
        this.showAlert(
          "success",
          "생성 완료",
          "회원 정보가 생성되었습니다.",
          this.close(true)
        );
      } catch (e) {
        this.showAlert(
          "error",
          "생성 실패",
          "회원 정보 생성 중 오류가 발생했습니다.",
          () => {
          }
        );
      }
    },
    async deleteUser() {
      Swal.fire({
        title: "해당 유저를 삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: `삭제`,
        cancelButtonText: `취소`
      }).then(async ({ value }) => {
        if (value) {
          try {
            const body = {
              mode: "DEL",
              login_level: this.userLevel,
              login_id: this.userId,
              ...this.user
            };
            await axiosInstance.post("/api/sy_user_action.php", body);

            this.showAlert(
              "success",
              "삭제 완료",
              "회원 정보가 삭제되었습니다!",
              this.close(true)
            );
          } catch (e) {
            this.showAlert(
              "error",
              "삭제 실패",
              "회원 정보 삭제 중 오류가 발생했습니다.",
              () => {
              }
            );
          }
        }
      });
    },
    init() {
      this.user = {
        user_id: "",
        user_nm: "",
        user_hp: "",
        user_level_nm: "",
        user_level: "",
        parent_user_nm: "",
        parent_user: "",
        password: "",
        password2: ""
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

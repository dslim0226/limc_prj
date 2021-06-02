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
              <md-input v-model="info.loginId" type="text" :disabled="true"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호</label>
              <md-input v-model="info.password" type="password"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호 확인</label>
              <md-input v-model="info.password2" type="password"></md-input>
            </md-field>
          </div>


          <div class="md-layout">
            <md-field>
              <label>이름</label>
              <md-input v-model="info.name" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>연락처</label>
              <md-input v-model="info.tel" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>가입일</label>
              <md-input v-model="info.createDate" type="text" :disabled="true" />
            </md-field>
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button type="submit" class="md-success" @click.native="join">수정</md-button>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import axios from "axios";
import Spinner from "@/components/Spinner";

export default {
  components: { Spinner },
  props: {
    mode: {
      type: String,
      default: "SAVE"
    },
    item: {
      type: Object
    }
  },
  async created() {
    this.loading = true;

    try {
      const { data } = await axios.get(
        "http://my-json-server.typicode.com/dslim0226/test-json/info"
      );
      this.info = { ...this.info, ...data };
    } catch (e) {
      console.log(e);
    }

    this.loading = false;
  },
  data: () => ({
    info: {
      id: "",
      loginId: "",
      name: "",
      password: "",
      password2: "",
      role: "",
      tel: "",
      master: "",
      createDate: ""
    },
    loading: false,
    modifyText: {
      title: `내 정보 수정 완료`,
      text: "내 정보 수정이 완료되었습니다."
    }
  }),
  methods: {
    showAlert() {
      Swal.fire({
        title: `내 정보 수정 완료`,
        text: "내 정보 수정이 완료되었습니다.",
        confirmButtonClass: "md-button md-success",
        type: "success"
      }).then(() => {
        this.$router.push({ path: "/list/contract" });
      });
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

.not-modify span{
  font-weight: 400;
}
.md-small-size-100 {
  text-align: left!important;
}
</style>

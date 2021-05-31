<template>
  <div class="md-layout md-alignment-center-center">
    <div class="md-layout-item md-size-40 md-small-size-100">
      <md-card>
        <md-card-header class="md-card-header-text md-card-header-green">
          <div class="card-text">
            <h4 class="title text-bold">내 정보</h4>
          </div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout">
            <md-field>
              <label>아이디</label>
              <md-input value="myIdSample" type="text" :disabled="true"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호</label>
              <md-input v-model="password" type="password"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>비밀번호 확인</label>
              <md-input v-model="password2" type="password"></md-input>
            </md-field>
          </div>


          <div class="md-layout">
            <md-field>
              <label>이름</label>
              <md-input v-model="name" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>연락처</label>
              <md-input v-model="tel" type="text"></md-input>
            </md-field>
          </div>

          <div class="md-layout">
            <md-field>
              <label>가입일</label>
              <md-input value="2021-02-26 17:33" type="text" :disabled="true" />
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
import _ from "lodash";
import axios from "axios";

export default {
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
    // try {
    //   const { data } = await axios.get(
    //     url
    //   );
    //   this.tableData = data;
    // } catch (e) {
    //   console.log(e);
    // }

    this.loading = false;
  },
  data: () => ({
    id: "",
    name: "임대성",
    password: "",
    password2: "",
    role: "0",
    tel: "010-8753-0343",
    master: "",
    createDate: "",
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

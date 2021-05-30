<template>
  <modal v-if="open" @close="$emit('close')" class="modal-user">
    <template slot="header">
      <h4 class="modal-title">내 정보</h4>
      <md-button
        class="md-simple md-just-icon md-round modal-default-button"
        @click="close"
      >
        <md-icon>clear</md-icon>
      </md-button>
    </template>

    <template slot="body">
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
    </template>

    <template slot="footer">
      <md-card-actions>
        <md-button type="submit" class="md-success" @click.native="join"
          >수정</md-button
        >
      </md-card-actions>
    </template>
  </modal>
</template>

<script>
import Swal from "sweetalert2";
import _ from "lodash";
import Modal from "@/components/Modal";

export default {
  components: { Modal },
  props: {
    open: {
      type: Boolean
    }
  },
  data: () => ({
    id: "",
    name: "임대성",
    password: "",
    password2: "",
    role: "0",
    tel: "010-8753-0343",
    master: "",
    createDate: ""
  }),
  methods: {
    join() {
      Swal.fire({
        title: `내 정보 수정 완료`,
        text: "내 정보 수정이 완료되었습니다.",
        confirmButtonClass: "md-button md-success",
        type: "success"
      }).then(() => {
        this.$router.push({ path: "/list/contract" });
      });
    },
    modify() {
      Swal.fire({
        title: `계정 수정 완료`,
        text: "계정 수정이 완료되었습니다.",
        confirmButtonClass: "md-button md-success",
        type: "success"
      }).then(() => {
        this.$router.push({ path: "/list/user" });
      });
    },
    close() {
      this.$emit("close");
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
</style>

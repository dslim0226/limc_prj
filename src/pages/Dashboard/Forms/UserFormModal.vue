<template>
  <modal v-if="open" @close="$emit('close')" class="modal-user">
    <template slot="header">
      <h4 class="modal-title" v-if="isSaveMode">계정 등록</h4>
      <h4 class="modal-title" v-else-if="isModifyMode">계정 수정</h4>
    </template>

    <template slot="body">
      <div class="md-layout">
        <md-field>
          <label>아이디</label>
          <md-input
            v-model="id"
            type="text"
            :disabled="isModifyMode"
          />
          <md-button class="md-primary md-dense md-button-pc">
            <span>중복 검사</span>
          </md-button>
        </md-field>
      </div>
      <md-button class="md-primary md-dense md-layout md-button-mobile">
        <span>중복 검사</span>
      </md-button>

      <div class="md-layout" v-if="isSaveMode">
        <md-field>
          <label>비밀번호</label>
          <md-input v-model="password" type="password"></md-input>
        </md-field>
      </div>

      <div class="md-layout" v-if="isSaveMode">
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
          <label>권한</label>
          <md-select
            v-model="role"
            name="movie"
            id="movie"
            :disabled="isModifyMode"
          >
            <md-option value="중간관리자">중간관리자</md-option>
            <md-option value="일반관리자">일반관리자</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>담당자</label>
          <md-select value="0" name="movie" id="movie" :disabled="isModifyMode">
            <md-option value="0">임대성</md-option>
            <md-option value="1">강찬수</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>연락처</label>
          <md-input v-model="tel" type="text"></md-input>
        </md-field>
      </div>

      <div class="md-layout" v-if="isModifyMode">
        <md-field>
          <label>가입일</label>
          <md-input :value="createDate" type="text" :disabled="true" />
        </md-field>
      </div>
    </template>

    <template slot="footer">
      <md-card-actions md-alignment="space-between">
        <div>
          <md-button
            @click="close"
            class="md-default md-dense"
          >
            닫기
          </md-button>
        </div>
        <div>
          <md-button
            type="submit"
            class="md-success"
            @click.native="join"
            v-if="isSaveMode"
            >생성
          </md-button>
          <md-button
            type="submit"
            class="md-success"
            @click.native="modify"
            v-else-if="isModifyMode"
          >수정
          </md-button>
        </div>
      </md-card-actions>
    </template>
  </modal>
</template>

<script>
import Swal from "sweetalert2";
import _ from "lodash";
import Modal from "@/components/Modal";

export default {
  created() {

  },
  components: { Modal },
  props: {
    mode: {
      type: String,
      default: "SAVE"
    },
    item: {
      type: Object
    },
    open: {
      type: Boolean
    }
  },
  watch: {
    item: function(item) {
      if (!_.isEmpty(item)) {
        this.id = item.id;
        this.name = item.name;
        this.role = item.role;
        this.tel = item.tel;
        this.master = item.master;
        this.createDate = item.createDate;
      }
    }
  },
  data: () => ({
    id: "",
    name: "",
    password: "",
    password2: "",
    role: "0",
    tel: "",
    master: "",
    createDate: ""
  }),
  computed: {
    isSaveMode() {
      return this.mode === "SAVE";
    },
    isModifyMode() {
      return this.mode === "MODIFY";
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    join() {
      Swal.fire({
        title: `계정 등록 완료`,
        text: "계정 등록이 완료되었습니다.",
        confirmButtonClass: "md-button md-success",
        type: "success"
      }).then(() => {
        this.close();
      });
    },
    modify() {
      Swal.fire({
        title: `계정 수정 완료`,
        text: "계정 수정이 완료되었습니다.",
        confirmButtonClass: "md-button md-success",
        type: "success"
      }).then(() => {
        this.close();
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

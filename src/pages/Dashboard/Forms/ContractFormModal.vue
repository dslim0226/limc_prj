<template>
  <modal v-if="open" @close="$emit('close')" class="modal-contract">
    <template slot="header">
      <h4 class="modal-title">
        계약 정보 {{(isSaveMode) ? '등록' : '수정'}}
      </h4>
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
          <label>상호명</label>
          <md-input v-model="name" type="text" />
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>주소</label>
          <md-input v-model="addr" :disabled="true" type="text" />
          <md-button class="md-default md-dense" @click="kakaoMap">
            <template>주소찾기</template>
          </md-button>
        </md-field>
        <md-field v-if="isSaveMode">
          <label>상세주소 입력</label>
          <md-input v-model="detail" type="text" />
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
          <label>대표명</label>
          <md-input v-model="contractor" type="text"></md-input>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>사진</label>
          <md-input :disabled="true" />
          <md-button class="md-default md-dense  md-fileinput">
            <template>찾아보기</template>
            <input
              multiple
              accept="image/*"
              type="file"
              name="circle"
              @change="onMenuFileChange"
              capture="camera"
            />
          </md-button>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>사업자등록증</label>
          <md-input :disabled="true" />
          <md-button class="md-default md-dense  md-fileinput">
            <template>찾아보기</template>
            <input
              multiple
              accept="image/*"
              type="file"
              name="circle"
              @change="onMenuFileChange"
              capture="camera"
            />
          </md-button>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>계약서</label>
          <md-input :disabled="true" />
          <md-button class="md-default md-dense  md-fileinput">
            <template>찾아보기</template>
            <input
              multiple
              accept="image/*"
              type="file"
              name="circle"
              @change="onMenuFileChange"
              capture="camera"
            />
          </md-button>
        </md-field>
      </div>

      <div class="md-layout" v-if="isReSendStatus">
        <md-field>
          <label>반려사유</label>
          <md-textarea :disabled="true" v-model="textarea" />
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
        <div v-if="isSaveStatus || isSaveMode">
          <md-button
            @click="save"
            class="md-info md-dense"
          >
            중간저장
          </md-button>
          <md-button
            @click="send"
            class="md-success md-dense"
          >
            신청
          </md-button>
        </div>
        <div v-else-if="isSendStatus">
          <md-button
            class="md-success md-dense"
          >
            승인
          </md-button>
          <md-button
            class="md-danger md-dense"
            @click.native="dis"
          >
            반려
          </md-button>
        </div>
        <div v-else-if="isReSendStatus">
          <md-button
            class="md-success md-dense"
          >
            재요청
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
        this.name = item.name;
        this.addr = item.addr;
        this.tel = item.tel;
        this.contractor = item.contractor;
        this.menu = item.menu;
        this.business = item.business;
        this.contract = item.contract;
        this.status = item.status;
      }
    }
  },
  data: () => ({
    name: "",
    addr: "",
    detail: "",
    tel: "",
    contractor: "",
    menu: [],
    business: [],
    contract: [],
    status: "",
    textarea: "이 곳에 반려사유가 출력됩니다."
  }),
  computed: {
    isSaveMode() {
      return this.mode === "SAVE";
    },
    isModifyMode() {
      return this.mode === "MODIFY";
    },
    isSaveStatus() {
      return this.status === "중간저장";
    },
    isSendStatus() {
      return this.status === "신청";
    },
    isApplyStatus() {
      return this.status === "승인";
    },
    isReSendStatus() {
      return this.status === "반려";
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      Swal.fire({
        title: `중간저장 완료`,
        text: "중간저장이 완료되었습니다.",
        confirmButtonClass: "md-button md-success",
        type: "success"
      }).then(() => {
        this.close();
      });
    },
    send() {
      Swal.fire({
        title: `신청 완료`,
        text: "신청이 완료되었습니다.",
        confirmButtonClass: "md-button md-success",
        type: "success"
      }).then(() => {
        this.close();
      });
    },
    kakaoMap() {
      const hello = this.hello;
      this.$loadScript("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js")
      .then(() => {
        new daum.Postcode({
          oncomplete: function(data) {
            hello(data.zonecode, data.jibunAddress);
          }
        }).open();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          text: `카카오 주소 검색 서비스 로딩 중 에러가 있습니다.<br>잠시 후 시도해주세요.`
        });
      });
    },
    hello(zip, addr) {
      this.addr = `(${zip}) ${addr}`;
    },
    onMenuFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (files.length > 0) {
        for (const item of files) {
          this.menu.push(item.name);
        }
      }
    },
    async dis() {
      Swal.fire({
        title: `반려사유를 작성해주세요.`,
        input: "textarea",
        inputLabel: "Message",
        showCancelButton: true
      }).then(() => {
        Swal.fire({
          title: `반려 완료`,
          text: "해당 계약건이 반려되었습니다.",
          confirmButtonClass: "md-button md-success",
          type: "success"
        }).then(() => {
          this.$router.push({ path: "/list/contract" });
        });
      });
    },
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
</style>

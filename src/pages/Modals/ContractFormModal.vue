<template>
  <modal v-if="open" class="modal-contract modal-height">
    <template slot="header">
      <h4 class="modal-title">계약 정보 {{ isSaveMode ? "등록" : "수정" }}</h4>
    </template>

    <template slot="body" v-if="infoLoading">
      <spinner />
    </template>
    <template slot="body" v-else>
      <div class="md-layout">
        <md-field>
          <label>상호명</label>
          <md-input
            :disabled="diffId || isSendStatus || isApplyStatus"
            v-model="contract.company_nm"
            type="text"
          />
          <span class="md-helper-text">상호명을 입력해주세요.</span>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>주소</label>
          <md-input
            v-model="contract.company_addr"
            :disabled="true"
            type="text"
          />
          <md-button
            :disabled="diffId || isSendStatus || isApplyStatus"
            class="md-default md-dense"
            @click="kakaoMap"
          >
            <template>주소찾기</template>
          </md-button>
        </md-field>
        <md-field>
          <label>상세주소 입력</label>
          <md-input
            :disabled="diffId || isSendStatus || isApplyStatus"
            v-model="contract.company_addr_detail"
            type="text"
          />
          <span class="md-helper-text">상세주소를 입력해주세요.</span>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>연락처</label>
          <md-input
            :disabled="diffId || isSendStatus || isApplyStatus"
            v-model="contract.company_tel"
            type="text"
          />
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>대표명</label>
          <md-input
            :disabled="diffId || isSendStatus || isApplyStatus"
            v-model="contract.company_ceo"
            type="text"
          />
          <span class="md-helper-text">대표명을 입력해주세요.</span>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>메뉴 사진</label>
          <md-input :disabled="true" />
          <md-button
            :disabled="diffId || isSendStatus || isApplyStatus"
            class="md-default md-dense md-fileinput"
          >
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
        <!-- 현재 업로드전 파일 -->
        <div
          class="files"
          v-for="(item, index) in contract.menuFiles"
          :key="index"
        >
          {{ item["name"] }}
          <md-button
            v-if="!(diffId || isApplyStatus || isSendStatus)"
            @click="deleteCurrentFile(item['id'], 'menu')"
            class="md-icon-button clearBtn"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
        <!-- 업로드가 되어있는 파일 -->
        <div
          class="files"
          v-for="(item, index) in contract.files.menu"
          :key="index"
        >
          <a :href="`/upload/menu/${item['file_temp_name']}`" target="_blank">{{
            item["file_name"]
          }}</a>
          <md-button
            v-if="!(diffId || isApplyStatus || isSendStatus)"
            @click="deleteFile(item['idx'], 'menu')"
            class="md-icon-button clearBtn"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
      </div>

      <div class="md-layout">
        <md-field>
          <label>사업자등록증</label>
          <md-input :disabled="true" />
          <md-button
            :disabled="diffId || isSendStatus || isApplyStatus"
            class="md-default md-dense md-fileinput"
          >
            <template>찾아보기</template>
            <input
              multiple
              accept="image/*"
              type="file"
              name="circle"
              @change="onBusinessFileChange"
              capture="camera"
            />
          </md-button>
        </md-field>
        <!-- 현재 업로드전 파일 -->
        <div
          class="files"
          v-for="(item, index) in contract.buisnessFiles"
          :key="index"
        >
          {{ item["name"] }}
          <md-button
            v-if="!(diffId || isApplyStatus || isSendStatus)"
            @click="deleteCurrentFile(item['id'], 'buisness')"
            class="md-icon-button clearBtn"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
        <!-- 업로드가 되어있는 파일 -->
        <div
          class="files"
          v-for="(item, index) in contract.files.buisness"
          :key="index"
        >
          <a
            :href="`/upload/buisness/${item['file_temp_name']}`"
            target="_blank"
            >{{ item["file_name"] }}</a
          >
          <md-button
            v-if="!(diffId || isApplyStatus || isSendStatus)"
            @click="deleteFile(item['idx'], 'buisness')"
            class="md-icon-button clearBtn"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
      </div>

      <div class="md-layout">
        <md-field>
          <label>계약서</label>
          <md-input :disabled="true" />
          <md-button
            :disabled="diffId || isSendStatus || isApplyStatus"
            class="md-default md-dense  md-fileinput"
          >
            <template>찾아보기</template>
            <input
              multiple
              accept="image/*"
              type="file"
              name="circle"
              @change="onContractFileChange"
              capture="camera"
            />
          </md-button>
        </md-field>
        <!-- 현재 업로드전 파일 -->
        <div
          class="files"
          v-for="(item, index) in contract.contractFiles"
          :key="index"
        >
          {{ item["name"] }}
          <md-button
            v-if="!(diffId || isApplyStatus || isSendStatus)"
            @click="deleteCurrentFile(item['id'], 'contract')"
            class="md-icon-button clearBtn"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
        <!-- 업로드가 되어있는 파일 -->
        <div
          class="files"
          v-for="(item, index) in contract.files.contract"
          :key="index"
        >
          <a
            :href="`/upload/contract/${item['file_temp_name']}`"
            target="_blank"
            >{{ item["file_name"] }}</a
          >
          <md-button
            v-if="!(diffId || isApplyStatus || isSendStatus)"
            @click="deleteFile(item['idx'], 'contract')"
            class="md-icon-button clearBtn"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
      </div>

      <div class="md-layout" v-if="isReSendStatus">
        <md-field>
          <label>반려사유</label>
          <md-textarea :disabled="true" v-model="contract.reject_msg" />
        </md-field>
      </div>

      <div class="md-layout mobile-button" v-if="showDeleteBtn">
        <md-button
          @click="deleteContract"
          class="md-danger md-dense mobile-button"
        >
          삭제
        </md-button>
      </div>
    </template>

    <template slot="footer">
      <md-card-actions md-alignment="space-between">
        <div>
          <md-button @click="close(false)" class="md-default md-dense">
            닫기
          </md-button>
          <md-button
            v-if="showDeleteBtn"
            @click="deleteContract"
            class="md-danger md-dense pc-button"
          >
            삭제
          </md-button>
        </div>
        <div v-if="(isSaveStatus || isSaveMode) && (!diffId || isSaveMode)">
          <md-button
            :disabled="loading"
            @click="save('01')"
            class="md-primary md-dense"
          >
            중간저장
          </md-button>
          <md-button
            :disabled="canSend || loading"
            @click="save('02')"
            class="md-success md-dense"
          >
            신청
          </md-button>
        </div>
        <div v-else-if="isSendStatus">
          <md-button
            :disabled="loading"
            class="md-success md-dense"
            @click="apply"
          >
            승인
          </md-button>
          <md-button
            :disabled="loading"
            class="md-danger md-dense"
            @click="dis"
          >
            반려
          </md-button>
        </div>
        <div v-else-if="isReSendStatus && !diffId">
          <md-button
            :disabled="canSend || loading"
            class="md-success md-dense"
            @click="save('02')"
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
import { axiosInstance } from "@/axiosModule";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import AlertMixin from "@/mixin/AlertMixin";
import AuthorityMixin from "@/mixin/AuthorityMixin";

export default {
  components: { Spinner, Modal },
  mixins: [AlertMixin, AuthorityMixin],
  props: {
    id: {
      type: String
    },
    open: {
      type: Boolean
    }
  },
  watch: {
    id: async function(id) {
      if (id !== "-1") {
        this.infoLoading = true;

        const { data } = await axiosInstance.get(`/api/contract_info.php`, {
          params: {
            idx: id
          }
        });

        this.contract = { ...this.contract, ...data["data"], idx: id };
        this.infoLoading = false;
      }
    }
  },
  data: () => ({
    contract: {
      idx: "-1",
      company_nm: "",
      company_addr: "",
      company_addr_detail: "",
      company_tel: "",
      company_ceo: "",
      insert_date: "",
      files: {},
      menuFiles: [],
      buisnessFiles: [],
      contractFiles: [],
      state: "",
      state_nm: "",
      contract_user_id: "",
      contract_user_nm: "",
      reject_msg: "",
      file_del_list: []
    },
    picIdx: 0,
    infoLoading: false,
    loading: false
  }),
  computed: {
    diffId() {
      return this.contract.contract_user_id !== this.userId && !this.isSaveMode;
    },
    showDeleteBtn() {
      return (
        ((!this.isSaveStatus && this.isChiefAdmin) ||
          (!this.diffId && this.isSaveStatus)) &&
        !this.isSaveMode
      );
    },
    hasMenuFiles() {
      return (
        this.contract.menuFiles.length > 0 ||
        (this.contract.files.menu && this.contract.files.menu.length > 0)
      );
    },
    hasBusinessFiles() {
      return (
        this.contract.buisnessFiles.length > 0 ||
        (this.contract.files.buisness &&
          this.contract.files.buisness.length > 0)
      );
    },
    hasContractFiles() {
      return (
        this.contract.contractFiles.length > 0 ||
        (this.contract.files.contract &&
          this.contract.files.contract.length > 0)
      );
    },
    canSend() {
      return !(
        this.contract.company_nm &&
        this.contract.company_addr &&
        this.contract.company_addr_detail &&
        this.contract.company_tel &&
        this.contract.company_ceo &&
        this.hasMenuFiles &&
        this.hasBusinessFiles &&
        this.hasContractFiles
      );
    },
    // this.id 가 -1 이 아니면 생성이 아니라 수정임
    isSaveMode() {
      return this.id === "-1";
    },
    // 중간저장이 된 상태
    isSaveStatus() {
      return this.contract.state === "01";
    },
    // 신청이 된 상태
    isSendStatus() {
      return (
        this.contract.state === "02" &&
        (this.isChiefAdmin || this.isMiddleAdmin)
      );
    },
    // 반려된 상태
    isReSendStatus() {
      return this.contract.state === "03";
    },
    // 승인된 상태
    isApplyStatus() {
      return this.contract.state === "04";
    }
  },
  methods: {
    close(refresh) {
      this.contract = {
        idx: "-1",
        company_nm: "",
        company_addr: "",
        company_addr_detail: "",
        company_tel: "",
        company_ceo: "",
        insert_date: "",
        files: {},
        menuFiles: [],
        buisnessFiles: [],
        contractFiles: [],
        state: "",
        state_nm: "",
        contract_user_id: "",
        contract_user_nm: "",
        reject_msg: "",
        file_del_list: []
      };
      this.picIdx = 0;

      this.$emit("close", refresh);
    },
    async save(state) {
      this.loading = true;
      const ct = this.contract;

      const body = {
        company_nm: ct.company_nm,
        company_addr: ct.company_addr,
        company_addr_detail: ct.company_addr_detail,
        company_tel: ct.company_tel,
        company_ceo: ct.company_ceo,
        state: state,
        login_id: this.userId,
        login_level: this.userLevel
      };

      if (this.contract.idx !== "-1") {
        body["idx"] = ct.idx;
        body["file_del_list"] = ct.file_del_list;
      }

      const form_data = new FormData();

      for (const key in body) {
        form_data.append(key, body[key]);
      }

      if (ct.menuFiles !== []) {
        for (const item of ct.menuFiles) {
          form_data.append("menuFiles[]", item);
        }
      }

      if (ct.buisnessFiles !== []) {
        for (const item of ct.buisnessFiles) {
          form_data.append("buisnessFiles[]", item);
        }
      }

      if (ct.contractFiles !== []) {
        for (const item of ct.contractFiles) {
          form_data.append("contractFiles[]", item);
        }
      }

      try {
        await axiosInstance.post("/api/contract_action.php", form_data);

        this.showAlert(
          "success",
          this.isSaveMode ? "저장 완료" : "수정 완료",
          this.isSaveMode
            ? "계약 정보가 저장되었습니다."
            : "계약 정보가 수정되었습니다.",
          this.close(true)
        );
      } catch (e) {
        console.log(e);
        this.showAlert(
          "error",
          "저장 실패",
          "계약 정보 저장중 오류가 발생했습니다.",
          () => {}
        );
      } finally {
        this.loading = false;
      }
    },
    kakaoMap() {
      const hello = this.hello;
      this.$loadScript(
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      )
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
      this.contract.company_addr = `(${zip}) ${addr}`;
    },
    async onMenuFileChange(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      const filesArray = Array.from(files);
      for (const item of filesArray) {
        item["id"] = this.picIdx++;
      }
      this.contract.menuFiles = [...this.contract.menuFiles, ...filesArray];
      e.target.value = "";
    },
    async onBusinessFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      const filesArray = Array.from(files);
      for (const item of filesArray) {
        item["id"] = this.picIdx++;
      }
      this.contract.buisnessFiles = [
        ...this.contract.buisnessFiles,
        ...filesArray
      ];
    },
    async onContractFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      const filesArray = Array.from(files);
      for (const item of filesArray) {
        item["id"] = this.picIdx++;
      }
      this.contract.contractFiles = [
        ...this.contract.contractFiles,
        ...filesArray
      ];
    },
    async apply() {
      this.loading = true;
      Swal.fire({
        title: "해당 계약건을 승인하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: `승인`,
        cancelButtonText: `취소`
      }).then(async ({ value }) => {
        if (value) {
          try {
            await axiosInstance.get("/api/contract_state.php", {
              params: {
                idx: this.contract.idx,
                state: "04",
                reject_msg: ""
              }
            });

            this.showAlert(
              "success",
              "승인 완료",
              "해당 계약건이 승인되었습니다!",
              this.close(true)
            );
          } catch (e) {
            this.showAlert(
              "error",
              "승인 실패",
              "해당 계약건 승인중 오류가 발생했습니다.",
              () => {}
            );
          } finally {
            this.loading = false;
          }
        }
      });
    },
    async dis() {
      this.loading = true;
      Swal.fire({
        title: `반려사유를 작성해주세요.`,
        input: "textarea",
        inputLabel: "Message",
        showCancelButton: true,
        confirmButtonText: `반려`,
        cancelButtonText: `취소`
      }).then(async ({ dismiss, value }) => {
        if (dismiss !== "cancel") {
          try {
            await axiosInstance.get("/api/contract_state.php", {
              params: {
                idx: this.contract.idx,
                state: "03",
                reject_msg: value
              }
            });

            this.showAlert(
              "success",
              "반려 완료",
              "해당 계약건이 반려되었습니다.",
              this.close(true)
            );
          } catch (e) {
            this.showAlert(
              "error",
              "반려 실패",
              "해당 계약건 반려 중 오류가 발생했습니다.",
              () => {}
            );
          } finally {
            this.loading = false;
          }
        }
      });
    },
    deleteCurrentFile(id, type) {
      this.contract[`${type}Files`] = this.contract[`${type}Files`].filter(
        x => x.id !== id
      );
      console.log(this.contract[`${type}Files`]);
    },
    deleteFile(idx, type) {
      this.contract["files"][type] = this.contract["files"][type].filter(
        x => x["idx"] !== idx
      );
      this.contract.file_del_list.push(idx);
    },
    deleteContract() {
      Swal.fire({
        title: "해당 계약건을 삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: `확인`,
        cancelButtonText: `취소`
      }).then(async ({ value }) => {
        if (value) {
          try {
            ///api/contract_del.php?idx=21&login_id=kokimin
            await axiosInstance.get("/api/contract_del.php", {
              params: {
                idx: this.contract.idx
              }
            });

            this.showAlert(
              "success",
              "삭제 완료",
              "해당 계약건이 삭제되었습니다!",
              this.close(true)
            );
          } catch (e) {
            this.showAlert(
              "error",
              "삭제 실패",
              "해당 계약건 삭제중 오류가 발생했습니다.",
              () => {}
            );
          }
        }
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

.md-layout {
  margin-bottom: 10px;
}

.files {
  display: flex;
  align-items: center;
  text-align: left;
  width: 100%;
  font-size: 0.8em;
  line-height: 120%;
}

.files > i {
  font-size: 0.9em !important;
  cursor: pointer;
  color: red !important;
  font-weight: bold;
  line-height: 120%;
}

.clearBtn {
  min-width: 20px;
  max-width: 20px;
  width: 20px;
  margin-left: 3px;
}
.pc-button {
  display: initial;
}
.mobile-button {
  display: none;
}
@media screen and (max-width: 992px) {
  .md-card-actions.md-alignment-space-between {
    justify-content: center;
  }
  .pc-button {
    display: none;
  }
  .mobile-button {
    width: 100%;
    display: initial;
  }
}
</style>

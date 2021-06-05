<template>
  <modal
    v-if="open"
    class="modal-contract modal-height"
  >
    <template slot="header">
      <h4 class="modal-title">계약 정보 {{ isSaveMode ? "등록" : "수정" }}</h4>
    </template>

    <template slot="body" v-if="loading">
      <spinner />
    </template>
    <template slot="body" v-else>
      <div class="md-layout">
        <md-field>
          <label>상호명</label>
          <md-input v-model="contract.company_nm" type="text" />
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
          <md-button class="md-default md-dense" @click="kakaoMap">
            <template>주소찾기</template>
          </md-button>
        </md-field>
        <md-field>
          <label>상세주소 입력</label>
          <md-input v-model="contract.company_addr_detail" type="text" />
          <span class="md-helper-text">상세주소를 입력해주세요.</span>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>연락처</label>
          <md-input v-model="contract.company_tel" type="text"></md-input>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>대표명</label>
          <md-input v-model="contract.company_ceo" type="text"></md-input>
          <span class="md-helper-text">대표명을 입력해주세요.</span>
        </md-field>
      </div>

      <div class="md-layout">
        <md-field>
          <label>메뉴 사진</label>
          <md-input :disabled="true" />
          <md-button class="md-default md-dense md-fileinput">
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
        <div
          class="files"
          v-for="(item, index) in contract.menuFiles"
          :key="index"
        >
          {{ item["name"] }}
          <md-button
            @click="deleteCurrentFile(item['lastModified'], 'menu')"
            class="md-icon-button"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
        <div
          class="files"
          v-for="(item, index) in contract.files.menu"
          :key="index"
        >
          {{ item["file_name"] }}
          <md-button
            @click="deleteFile(item['idx'], 'menu')"
            class="md-icon-button"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
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
              @change="onBusinessFileChange"
              capture="camera"
            />
          </md-button>
        </md-field>
        <div
          class="files"
          v-for="(item, index) in contract.buisnessFiles"
          :key="index"
        >
          {{ item["name"] }}
          <md-button
            @click="deleteCurrentFile(item['lastModified'], 'buiness')"
            class="md-icon-button"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
        <div
          class="files"
          v-for="(item, index) in contract.files.buisness"
          :key="index"
        >
          {{ item["file_name"] }}
          <md-button
            @click="deleteFile(item['idx'], 'buisness')"
            class="md-icon-button"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
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
              @change="onContractFileChange"
              capture="camera"
            />
          </md-button>
        </md-field>
        <div
          class="files"
          v-for="(item, index) in contract.contractFiles"
          :key="index"
        >
          {{ item["name"] }}
          <md-button
            @click="deleteCurrentFile(item['lastModified'], 'contract')"
            class="md-icon-button"
          >
            <md-icon>clear</md-icon>
          </md-button>
        </div>
        <div
          class="files"
          v-for="(item, index) in contract.files.contract"
          :key="index"
        >
          {{ item["file_name"] }}
          <md-button
            @click="deleteFile(item['idx'], 'contract')"
            class="md-icon-button"
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
    </template>

    <template slot="footer">
      <md-card-actions md-alignment="space-between">
        <div>
          <md-button @click="close(false)" class="md-default md-dense">
            닫기
          </md-button>
        </div>
        <div
          v-if="
            (isSaveStatus || isSaveMode) &&
              (this.isGeneralUser || this.isMiddleAdmin)
          "
        >
          <md-button @click="save('01')" class="md-info md-dense">
            중간저장
          </md-button>
          <md-button @click="save('02')" class="md-success md-dense">
            신청
          </md-button>
        </div>
        <div v-else-if="isSendStatus">
          <md-button class="md-success md-dense">
            승인
          </md-button>
          <md-button class="md-danger md-dense" @click.native="dis">
            반려
          </md-button>
        </div>
        <div v-else-if="isReSendStatus">
          <md-button class="md-success md-dense">
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
        this.loading = true;

        const { data } = await axiosInstance.get(`/api/contract_info.php`, {
          params: {
            idx: id
          }
        });

        this.contract = { ...this.contract, ...data["data"], idx: id };
        this.loading = false;
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
    loading: false
  }),
  computed: {
    isSaveMode() {
      return this.id === "-1";
    },
    isSaveStatus() {
      return this.contract.state === "01";
    },
    isSendStatus() {
      return (
        this.contract.state === "02" &&
        (this.isChiefAdmin || this.isMiddleAdmin)
      );
    },
    isApplyStatus() {
      return this.contract.state === "04";
    },
    isReSendStatus() {
      return this.contract.state === "03";
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

      this.$emit("close", refresh);
    },
    async save(state) {
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
          form_data.append("menuFiles", item);
        }
      }

      if (ct.buisnessFiles !== []) {
        for (const item of ct.buisnessFiles) {
          form_data.append("buisnessFiles", item);
        }
      }

      if (ct.contractFiles !== []) {
        for (const item of ct.contractFiles) {
          form_data.append("contractFiles", item);
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
          () => {
          }
        );
      }
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
      let files = e.target.files || e.dataTransfer.files;
      const filesArray = Array.from(files);
      this.contract.menuFiles = [...this.contract.menuFiles, ...filesArray];
      console.log(this.contract.menuFiles);
    },
    async onBusinessFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      const filesArray = Array.from(files);
      this.contract.buisnessFiles = [
        ...this.contract.buisnessFiles,
        ...filesArray
      ];
    },
    async onContractFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      const filesArray = Array.from(files);
      this.contract.contractFiles = [
        ...this.contract.contractFiles,
        ...filesArray
      ];
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
    deleteCurrentFile(id, type) {
      const file = this.contract[`${type}Files`];
      this.contract[`${type}Files`] = file.filter(
        x => x["lastModified"] !== id
      );
    },
    deleteFile(idx, type) {
      this.contract["files"][type] = this.contract["files"][type].filter(
        x => x["idx"] !== idx
      );
      this.contract.file_del_list.push(idx);
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
  text-align: left;
  width: 100%;
  display: block;
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
</style>

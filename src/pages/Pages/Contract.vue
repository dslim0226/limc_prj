<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <md-card class="search-top">
        <md-card-header class="md-card-header-text md-card-header-green">
          <div class="card-icon">
            <md-icon>search</md-icon>
          </div>
          <h4 class="title">검색</h4>
        </md-card-header>

        <md-card-content md-alignment="space-between">
          <div class="table-top">
            <div class="md-layout-item md-layout table-top-left">
              <md-field
                class="md-layout-item md-xsmall-size-100 md-size-20 mr-5"
              >
                <label for="filter">상태</label>
                <md-select v-model="state">
                  <md-option value="">
                    전체
                  </md-option>
                  <md-option
                    v-for="(item, index) in business_cd"
                    :key="index"
                    :value="item['code_cd']"
                  >
                    {{ item["code_nm"] }}
                  </md-option>
                </md-select>
              </md-field>
              <md-field class="md-layout-item md-xsmall-size-100 md-size-25">
                <label>상호명</label>
                <md-input v-model="text" @keypress.enter="searching" />
                <md-button @click="searching" class="md-icon-button">
                  <md-icon>search</md-icon>
                </md-button>
              </md-field>
            </div>
            <md-button
              class="md-dense md-layout-item md-xsmall-size-100 md-size-10"
              @click="excelDownload"
            >엑셀다운로드</md-button
            >
          </div>
        </md-card-content>
      </md-card>

      <md-card>
        <md-card-header class="md-card-header-text md-card-header-green">
          <div class="card-icon">
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">
            계약 목록
            <div class="table-header-button">
              <md-button
                class="md-success md-dense"
                @click="openModal('-1')"
                >등록</md-button
              >
            </div>
          </h4>
        </md-card-header>
        <md-card-content>
          <spinner v-if="loading" />
          <md-table v-model="tableData" table-header-color="green" v-else>
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="상호명">{{
                item["company_nm"]
              }}</md-table-cell>
              <md-table-cell md-label="주소">{{
                `${item["company_addr"]} ${item["company_addr_detail"]}`
              }}</md-table-cell>
              <md-table-cell md-label="연락처">{{
                item["company_tel"]
              }}</md-table-cell>
              <md-table-cell md-label="대표자명">{{
                item["company_ceo"]
              }}</md-table-cell>
              <md-table-cell md-label="담당자">{{
                item["contract_user_nm"]
              }}</md-table-cell>
              <md-table-cell md-label="메뉴판" class="text-center">{{
                +item["menuCnt"] > 0 ? "O" : "X"
              }}</md-table-cell>
              <md-table-cell md-label="사업자등록증" class="text-center">{{
                +item["buisnessCnt"] > 0 ? "O" : "X"
              }}</md-table-cell>
              <md-table-cell md-label="계약서" class="text-center">{{
                +item["contractCnt"] > 0 ? "O" : "X"
              }}</md-table-cell>
              <md-table-cell md-label="상태">{{
                item["state_nm"]
              }}</md-table-cell>
              <md-table-cell md-label="등록일">{{
                item["insert_date"]
              }}</md-table-cell>
              <md-table-cell md-label="비고" style="">
                <md-button
                  class="md-primary md-icon-button"
                  @click.native="openModal(item['idx'])"
                >
                  <md-icon>edit</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
            <div class="no-data" v-if="tableData.length < 1">
              {{
                search.isSearching
                  ? "검색조건에 맞는 데이터가 없습니다."
                  : "데이터가 없습니다."
              }}
            </div>
          </md-table>
          <div class="paging">
            <pagination
              @input="chgPage"
              v-model="paging.page"
              :per-page="paging.limit"
              :total="paging.total"
            />
          </div>
        </md-card-content>
      </md-card>
    </div>
    <ContractFormModal @close="close" :id="id" :mode="modalMode" :open="open" />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import ContractFormModal from "@/pages/Modals/ContractFormModal";
import { axiosInstance } from "@/axiosModule";
import Spinner from "@/components/Spinner";
import _ from "lodash";
import AlertMixin from "@/mixin/AlertMixin";
import AuthorityMixin from "@/mixin/AuthorityMixin";

export default {
  components: { Spinner, ContractFormModal, Pagination },
  mixins: [AlertMixin, AuthorityMixin],
  async created() {
    // 검색 상태 공통코드 로드
    const role = await axiosInstance.get("/api/common.php", {
      params: {
        business_cd: "SY00002"
      }
    });

    this.business_cd = role["data"]["data"]["rows"];

    this.loading = true;
    await this.loadData();
    this.loading = false;
  },
  data() {
    return {
      id: "-1",
      paging: {
        page: 1,
        limit: 5,
        total: 50
      },
      tableData: [],
      state: "",
      text: "",
      search: {
        state: "",
        text: "",
        isSearching: false
      },
      open: false,
      modalMode: "SAVE",
      loading: false,
      business_cd: []
    };
  },
  methods: {
    openModal(id) {
      this.open = true;
      this.id = id;
    },
    async close(refresh) {
      this.open = false;
      this.id = "-1";
      if(refresh) {
        await this.loadData();
      }
    },
    async searching() {
      this.search.isSearching = this.searchLevel || this.text;
      this.search.state = this.state;
      this.search.text = this.text;
      this.paging.page = 1;
      await this.loadData();
    },
    searchEnter() {
      if (this.hasSearchText && !this.search.isSearching) {
        this.searching();
      }
    },
    async chgPage(item) {
      this.loading = true;
      await this.loadData();
      this.loading = false;
    },
    async loadData() {
      try {
        const param = {
          page: this.paging.page,
          limit: this.paging.limit,
          state: ""
        };

        if (this.search.isSearching) {
          if (this.search.state) param["state"] = this.search.state;
          if (this.search.text) param["search_nm"] = this.search.text;
        }

        const { data } = await axiosInstance.get("/api/contract.php", {
          params: param
        });

        this.tableData = _.isEmpty(data["data"]["rows"])
          ? []
          : data["data"]["rows"];

        this.paging.total = data["data"]["records"];
      } catch (e) {
        console.log(e);
        this.showAlert("error", "접근 오류", "일시적 오류입니다.", () => {
          this.$router.push("/");
        });
      } finally {
        this.loading = false;
      }
    },
    async excelDownload() {
      window.open(
        `http://kokimin7805.cafe24.com/api/contract_excel.php?state=${this.state}&search_nm=${this.text}&login_id=${this.userId}&login_level=${this.userLevel}`
      );
    }
  }
};
</script>
<style scoped>
.paging {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mr-5 {
  margin-right: 1%;
}

.table-top {
  display: flex;
  align-items: center;
}

.table-top .table-top-left {
  margin-right: 0;
}
</style>

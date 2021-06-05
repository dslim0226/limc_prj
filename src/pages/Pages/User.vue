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

        <md-card-content>
          <div class="table-top">
            <div class="md-layout-item md-layout table-top-left">
              <md-field
                class="md-layout-item md-xsmall-size-100 md-size-20 mr-5"
              >
                <label for="filter">권한</label>
                <md-select v-model="searchLevel" :disabled="this.isMiddleAdmin">
                >
                  <md-option
                    v-for="(item, index) in business_cd"
                    :key="index"
                    :value="item['code_cd']"
                  >
                    {{ item['code_nm'] }}
                  </md-option>
                </md-select>
              </md-field>
              <md-field
                class="md-layout-item md-xsmall-size-100 md-size-25"
                style="padding-right:0;"
              >
                <label>아이디 / 이름</label>
                <md-input v-model="text" @keypress.enter="searchEnter"/>
                <md-button
                  @click="searching"
                  :disabled="!hasSearchText && !search.isSearching"
                  class="md-icon-button"
                >
                  <md-icon>{{ search.isSearching ? "clear" : "search" }}</md-icon>
                </md-button>
              </md-field>
            </div>
          </div>
        </md-card-content>
      </md-card>

      <md-card>
        <md-card-header class="md-card-header-text md-card-header-green">
          <div class="card-icon">
            <md-icon>groups</md-icon>
          </div>
          <h4 class="title">
            회원 목록
            <div class="table-header-button">
              <md-button class="md-success md-dense" @click="openModal('-1')"
                >등록</md-button
              >
            </div>
          </h4>
        </md-card-header>
        <md-card-content>
          <spinner v-if="loading" />
          <md-table v-model="tableData" table-header-color="green">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="아이디">{{
                item["user_id"]
              }}</md-table-cell>
              <md-table-cell md-label="이름">{{ item["user_nm"] }}</md-table-cell>
              <md-table-cell md-label="전화번호">{{ item["user_hp"] }}</md-table-cell>
              <md-table-cell md-label="권한">{{ item["user_level_nm"] }}</md-table-cell>
              <md-table-cell md-label="관리자">{{ item["parent_user_nm"] }}</md-table-cell>
              <md-table-cell md-label="가입일">{{ item["insert_date"] }}</md-table-cell>
              <md-table-cell md-label="수정" style="">
                <md-button
                  class="md-primary md-fab md-icon-button"
                  @click="openModal(item['user_id'])"
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
    <user-form-modal @close="close" :id="id" :open="open" :business_cd="business_cd" />
  </div>
</template>
<script>
import _ from "lodash";
import Pagination from "@/components/Pagination";
import UserFormModal from "@/pages/Modals/UserFormModal";
import Spinner from "@/components/Spinner";
import AuthorityMixin from "@/mixin/AuthorityMixin";
import AlertMixin from "@/mixin/AlertMixin";
import { axiosInstance } from "@/axiosModule";

export default {
  components: { Spinner, UserFormModal, Pagination },
  mixins: [AuthorityMixin, AlertMixin],

  async created() {
    // 일반 유저 접근 금지
    if(this.isGeneralUser) {
      this.showAlert("error", "접근 오류", "일반회원은 접근할 수 없습니다.", () => { this.$router.push('/') });
    }

    // 검색 권한 공통코드 로드
    const role = await axiosInstance.get("/api/common.php", {
      params: {
        business_cd: "SY00001"
      }
    });

    this.business_cd = role["data"]["data"]["rows"];

    // 중간관리자인 경우엔 일반관리자만 검색할 수 있게 하는 로직
    if (this.isMiddleAdmin) this.searchLevel = this.userRole.GENERAL_USER;

    this.loading = true;
    await this.loadData();
    this.loading = false;
  },
  computed: {
    hasSearchText() {
      return this.text.length > 0 || this.searchLevel;
    }
  },
  data() {
    return {
      paging: {
        page: 1,
        limit: 5,
        total: 50
      },
      tableData: [],
      open: false,
      id: "-1",
      searchLevel: "",
      text: "",
      search: {
        userLevel: "",
        text: "",
        isSearching: false
      },
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
        this.loading = true;
        try {
          const param = {
            page: this.paging.page,
            limit: this.paging.limit
          }
          const { data } = await axiosInstance.get("/api/sy_user.php", {
            params : param
          });

          this.tableData = data["data"]["rows"];
          this.paging.total = data["data"]["records"];
        } catch (e) {
          console.log(e);
          this.showAlert("error", "접근 오류", "일시적 오류입니다.", () => { this.$router.push('/') });
        } finally {
          this.loading = false;
        }
      }
    },
    async searching() {
      if(this.search.isSearching) {
        this.searchLevel = "";
        this.text = "";
      }
      this.search.isSearching = !this.search.isSearching;
      this.search.userLevel = this.searchLevel;
      this.search.text = this.text;
      this.paging.page = 1;
      await this.loadData();
    },
    searchEnter() {
      if(this.hasSearchText && !this.search.isSearching) {
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
          limit: this.paging.limit
        }

        if(this.search.isSearching) {
          if(this.search.text) param["search_nm"] = this.search.text;
          if(this.search.userLevel) param["user_level"] = this.search.userLevel;
        }

        const { data } = await axiosInstance.get("/api/sy_user.php", {
          params : param
        });

        if(_.isEmpty(data["data"]["rows"])) {
          this.tableData = [];
        } else {
          this.tableData = data["data"]["rows"];
        }
        this.paging.total = data["data"]["records"];
      } catch (e) {
        console.log(e);
        this.showAlert("error", "접근 오류", "일시적 오류입니다.", () => { this.$router.push('/') });
      } finally {
        this.loading = false;
      }

    },
  }
};
</script>
<style>
.paging {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-bold {
  font-weight: 500 !important;
}

.mr-5 {
  margin-right: 1%;
}

.table-top {
  display: flex;
}

.table-top .table-top-left {
  margin-right: 0;
}

.table-top .table-top-right {
  margin-left: 0;
}

.md-table-cell-container {
  text-align: center !important;
}
.md-table-head-container {
  text-align: center !important;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9em;
  padding: 3em 0.5em;
}
</style>

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
                <md-select
                  v-model="search.authority"
                  name="filter"
                  id="filter"
                  :disabled="this.isMiddleAdmin"
                >
                  <md-option :value="userRole.MIDDLE_ADMIN" v-if="isChiefAdmin"
                    >중간관리자</md-option
                  >
                  <md-option :value="userRole.GENERAL_USER"
                    >일반관리자</md-option
                  >
                </md-select>
              </md-field>
              <md-field
                class="md-layout-item md-xsmall-size-100 md-size-25"
                style="padding-right:0;"
              >
                <label>아이디 / 이름</label>
                <md-input v-model="search.text" />
                <md-button :disabled="!hasSearchText" class="md-icon-button">
                  <md-icon>search</md-icon>
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
              <md-button class="md-success md-dense" @click="openModal(-1)"
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
                item.loginId
              }}</md-table-cell>
              <md-table-cell md-label="이름">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="전화번호">{{ item.tel }}</md-table-cell>
              <md-table-cell md-label="권한">{{ item.role }}</md-table-cell>
              <md-table-cell md-label="관리자">{{ item.master }}</md-table-cell>
              <md-table-cell md-label="가입일"
                >{{ item.createDate }}
              </md-table-cell>
              <md-table-cell md-label="수정" style="">
                <md-button
                  class="md-primary md-fab md-icon-button"
                  @click.native="openModal(item.id)"
                >
                  <md-icon>edit</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="paging">
            <pagination
              v-model="currentPage"
              :per-page="perPage"
              :total="total"
            />
          </div>
        </md-card-content>
      </md-card>
    </div>
    <user-form-modal @close="close" :id="id" :open="open" />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import UserFormModal from "@/pages/Modals/UserFormModal";
import axios from "axios";
import Spinner from "@/components/Spinner";
import AuthorityMixin from "@/mixin/AuthorityMixin";

export default {
  components: { Spinner, UserFormModal, Pagination },
  mixins: [AuthorityMixin],
  async created() {
    if (this.isMiddleAdmin) this.search.authority = this.userRole.GENERAL_USER;
    this.loading = true;
    try {
      const { data } = await axios.get(
        "http://my-json-server.typicode.com/dslim0226/test-json/user"
      );
      this.tableData = data;
    } catch (e) {
      console.log(e);
    }

    this.loading = false;
  },
  computed: {
    hasSearchText() {
      return this.search.text.length > 0;
    }
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      total: 50,
      tableData: [],
      open: false,
      id: -1,
      search: {
        authority: "",
        text: ""
      },
      loading: false
    };
  },
  methods: {
    openModal(id) {
      this.open = true;
      this.id = id;
    },
    close() {
      this.open = false;
      this.id = -1;
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
</style>

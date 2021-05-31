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
                <label for="filter">상태</label>
                <md-select value="" name="filter" id="filter">
                  <!--                  <md-option value="0">중간저장</md-option>-->
                  <!-- 중간저장은 자신만 보이도록 (내꺼+중간저장) -->
                  <md-option value="1">신청</md-option>
                  <md-option value="2">승인</md-option>
                  <md-option value="3">반려</md-option>
                  <md-option value="4">계약종료</md-option>
                </md-select>
              </md-field>
              <md-field class="md-layout-item md-xsmall-size-100 md-size-25">
                <label>상호명</label>
                <md-input v-model="search" />
                <md-button @click="searching" class="md-icon-button">
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
            <md-icon>assignment</md-icon>
          </div>
          <h4 class="title">
            계약 목록
            <div class="table-header-button">
              <md-button
                class="md-success md-dense"
                @click="openModal(-1, 'SAVE')"
                >등록</md-button
              >
            </div>
          </h4>
        </md-card-header>
        <md-card-content>
          <spinner  v-if="loading" />
          <md-table v-model="tableData" table-header-color="green" v-else>
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="상호명">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="주소">{{ item.addr }}</md-table-cell>
              <md-table-cell md-label="연락처">{{ item.tel }}</md-table-cell>
              <md-table-cell md-label="대표자명">{{
                item.contractor
              }}</md-table-cell>
              <md-table-cell md-label="담당자">{{ item.master }}</md-table-cell>
              <md-table-cell md-label="메뉴판" class="text-center">{{ item.menu ? "O" : "X" }}</md-table-cell>
              <md-table-cell md-label="사업자등록증" class="text-center">{{
                item.business ? "O" : "X"
              }}</md-table-cell>
              <md-table-cell md-label="계약서" class="text-center">{{
                item.contract ? "O" : "X"
              }}</md-table-cell>
              <md-table-cell md-label="상태">{{ item.status }}</md-table-cell>
              <md-table-cell md-label="등록일">{{
                item.createDate
              }}</md-table-cell>
              <md-table-cell md-label="비고" style="">
                <md-button
                  class="md-info md-icon-button"
                  @click.native="openModal(item.id, 'MODIFY')"
                >
                  <md-icon>edit</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="paging">
            <pagination
              :total="total"
              :per-page="perPage"
              v-model="currentPage"
              @input="chgPage"
            />
          </div>
        </md-card-content>
      </md-card>
    </div>
    <ContractFormModal
      @close="close"
      :id="id"
      :mode="modalMode"
      :open="open"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import ContractFormModal from "@/pages/Dashboard/Forms/ContractFormModal";
import axios from "axios";
import Spinner from "@/components/Spinner";

export default {
  components: { Spinner, ContractFormModal, Pagination },
  async created() {
    this.loading = true;
    try {
      const { data } = await axios.get(
        "http://my-json-server.typicode.com/dslim0226/test-json/contract"
      );
      this.tableData = data;
    } catch (e) {
      console.log(e);
    }

    this.loading = false;
  },
  data() {
    return {
      id: 0,
      currentPage: 1,
      perPage: 10,
      total: 88,
      tableData: [],
      search: "",
      open: false,
      modalMode: "SAVE",
      loading: false
    };
  },
  methods: {
    openModal(id, mode) {
      this.open = true;
      this.id = id;
      this.modalMode = mode;
    },
    close() {
      this.open = false;
      this.modalMode = "SAVE";
      this.modalItem = {};
    },
    async searching() {
      console.log("Not Yet");
      // this.loading = true;
      // const { data } = await axios.get(url);
      //
      // this.tableData = data;
      // this.loading = false;
    },
    async chgPage(item) {
      // this.loading = true;
      // const { data } = await axios.get(url, params: {
      //  page: item
      // });
      //
      // this.tableData = data;
      // this.loading = false;
    }
  }
};
// TODO : AXIOS 연결은 목록 까지만 했음.
// TODO : Search, Paging, my-info, 목록에서 detail 불러올떄 id 기준으로 가져올 수 있게 작업
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
}

.table-top .table-top-left {
  margin-right: 0;
}
</style>

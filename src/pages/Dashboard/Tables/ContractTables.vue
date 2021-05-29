<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">

      <md-card>
        <md-card-header class="md-card-header-text md-card-header-green">
          <div class="card-text">
            <h4 class="title text-bold">계약 목록</h4>
          </div>
        </md-card-header>
        <md-card-content>
          <div class="table-top">
            <div class="md-layout-item md-layout table-top-left">
              <md-field class="md-layout-item md-large-size-15 md-small-size-45 md-xsmall-size-100 mr-5">
                <label for="filter">상태</label>
                <md-select value="" name="filter" id="filter">
                  <md-option value="0">중간저장</md-option>
                  <md-option value="1">신청</md-option>
                  <md-option value="2">승인</md-option>
                  <md-option value="3">반려</md-option>
                  <md-option value="4">계약종료</md-option>
                </md-select>
              </md-field>
              <md-field class="md-layout-item md-large-size-20 md-small-size-45 md-xsmall-size-100"
                        style="padding-right:0;">
                <label>상호명</label>
                <md-input v-model="search" />
                <md-button class="md-icon-button">
                  <md-icon>search</md-icon>
                </md-button>
              </md-field>
            </div>
            <div class="table-top-left">
              <md-button class="md-primary" @click="openModal({}, 'SAVE')">등록</md-button>
            </div>
          </div>
          <md-table v-model="tableData" table-header-color="green">
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="상호명">{{ item.name }}</md-table-cell>
              <md-table-cell md-label="주소">{{ item.addr }}</md-table-cell>
              <md-table-cell md-label="연락처">{{ item.tel }}</md-table-cell>
              <md-table-cell md-label="대표자명">{{ item.contractor }}</md-table-cell>
              <md-table-cell md-label="담당자">{{ item.master }}</md-table-cell>
              <md-table-cell md-label="메뉴판">{{ item.menu }}</md-table-cell>
              <md-table-cell md-label="사업자등록증">{{ item.business }}</md-table-cell>
              <md-table-cell md-label="계약서">{{ item.contract }}</md-table-cell>
              <md-table-cell md-label="상태">{{ item.status }}</md-table-cell>
              <md-table-cell md-label="등록일">{{ item.createDate }}</md-table-cell>
              <md-table-cell md-label="수정" style="">
                <md-button class="md-primary md-fab md-icon-button" @click.native="openModal(item, 'MODIFY')">
                  <md-icon>edit</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
          <div class="paging">
            <pagination v-model="currentPage"
                        :per-page="perPage"
                        :total="total" />
          </div>
        </md-card-content>
      </md-card>
    </div>
    <ContractFormModal
      @close="close"
      :item="modalItem"
      :mode="modalMode"
      :open="open"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { contract } from "@/pages/Dashboard/Tables/users";
import ContractFormModal from "@/pages/Dashboard/Forms/ContractFormModal";

export default {
  components: { ContractFormModal, Pagination },
  created() {
    this.tableData = contract;
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      total: 50,
      tableData: [],
      search: "",
      open: false,
      modalMode: "SAVE",
      modalItem: {}
    };
  },
  methods: {
    openModal(item, mode) {
      this.open = true;
      this.modalItem = item;
      this.modalMode = mode;
    },
    close() {
      this.open = false;
      this.modalMode = "SAVE";
      this.modalItem = {};
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

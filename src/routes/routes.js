import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";

import UserForm from "@/pages/Dashboard/Forms/UserForm.vue";

import UserTables from "@/pages/Dashboard/Tables/UserTables.vue";

import ContractForm from "@/pages/Dashboard/Forms/ContractForm";
import ContractTables from "@/pages/Dashboard/Tables/ContractTables";
import MyInfo from "@/pages/Dashboard/Forms/MyInfo";


let tablesMenu = {
  path: "/",
  component: DashboardLayout,
  name: "menus",
  children: [
    {
      path: "/list/user",
      name: "userList",
      component: UserTables
    },
    {
      path: "/list/contract",
      name: "contractList",
      component: ContractTables
    },
    {
      path: "/user",
      name: "user",
      component: UserForm,
      props: true
    },
    {
      path: "/contract",
      name: "contract",
      component: ContractForm,
      props: true
    },
    {
      path: "/info",
      name: "info",
      component: MyInfo,
      props: true
    }
  ]
};


const routes = [
  {
    path: "/",
    redirect: "/list/contract",
    name: "Home"
  },
  tablesMenu,
];

export default routes;

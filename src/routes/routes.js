import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";


import UserTables from "@/pages/Dashboard/Tables/UserTables.vue";

import ContractTables from "@/pages/Dashboard/Tables/ContractTables";
import MyInfo from "@/pages/Dashboard/Forms/MyInfo";
import Login from "@/pages/Dashboard/Pages/Login";
import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout";

let AuthMenu = {
  path: "/",
  component: AuthLayout,
  name: "auth",
  children: [
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
};

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
  AuthMenu
];

export default routes;

import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import UserTables from "@/pages/Pages/User.vue";

import ContractTables from "@/pages/Pages/Contract";
import MyInfo from "@/pages/Pages/MyInfo";
import Login from "@/pages/Pages/Login";
import AuthLayout from "@/pages/Layout/AuthLayout";

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

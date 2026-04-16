import Vue from "vue";
import Router from "vue-router";

import BookList from "./views/BookList.vue";
import BookManager from "./views/BookManager.vue";
import RentalBook from "./views/RentalBook.vue";
import RentalList from "./views/RentalList.vue";
import SignIn from "./views/SignIn.vue";
import SignOut from "./views/SignOut.vue";
import Sorry from "./views/Sorry.vue";
import Student from "./views/Student.vue";
import Top from "./views/Top.vue";
import UserList from "./views/UserList.vue";
import UserCreate from "./views/UserCreate.vue";
import UserManager from "./views/UserManager.vue";
import InformationManager from "./views/InformationManager.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/pages/sign-in.html",
      name: "signIn",
      props: true,
      component: SignIn,
    },
    {
      path: "/pages/sign-out.html",
      name: "signOut",
      component: SignOut,
    },
    {
      path: "/pages/top.html",
      name: "top",
      component: Top,
    },
    {
      path: "/pages/book/list.html",
      name: "bookList",
      component: BookList,
    },
    {
      path: "/pages/book/manager.html",
      name: "bookManager",
      component: BookManager,
    },
    {
      path: "/pages/user/list.html",
      name: "userList",
      props: true,
      component: UserList,
    },
    {
      path: "/pages/user/create.html",
      name: "userCreate",
      component: UserCreate,
    },
    {
      path: "/pages/user/manager.html",
      name: "userManager",
      component: UserManager,
    },
    {
      path: "/pages/book/rental.html",
      name: "rentalBook",
      component: RentalBook,
    },
    {
      path: "/pages/book/rental/list.html",
      name: "rentalList",
      component: RentalList,
    },
    {
      path: "/pages/student.html",
      name: "student",
      component: Student,
    },
    {
      path: "/pages/information/manager.html",
      name: "informationManager",
      component: InformationManager,
    },
    {
      path: "*",
      name: "sorry",
      component: Sorry,
    },
  ],
});

<template>
  <!-- Menu -->
  <ul class="sidebar navbar-nav" ref="test">
    <li class="nav-item active">
      <router-link tag="a" class="nav-link" :to="{ name: 'top' }">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>トップページ</span>
      </router-link>
    </li>
    <li v-for="(menu, i) in menuList" :key="`bad-sample_${i}`" class="nav-item active">
      <router-link tag="a" class="nav-link" :to="{ name: menu.name }">
        <i v-bind:class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
import * as UserUtil from "@/utils/UserUtil";

export default {
  data() {
    /**
     * メニュー定義
     *    title: タイトル
     *    name: ルーティングする名称
     *    icon: Font Awesomeのアイコンを指定
     *    onlyAdmin: true:管理者のみ/false:管理者、一般で使用可能
     */
    return {
      menuList: [
        { title: "書籍一覧", name: "bookList", icon: "fas fa-fw fa-book-medical", onlyAdmin: false },
        { title: "書籍管理", name: "bookManager", icon: "fas fa-fw fa-book-medical", onlyAdmin: true },
        { title: "ユーザー一覧", name: "userList", icon: "fas fa-fw fa-user", onlyAdmin: true },
        { title: "ユーザー追加", name: "userCreate", icon: "fas fa-fw fa-user", onlyAdmin: true },
        { title: "ユーザー管理", name: "userManager", icon: "fas fa-fw fa-user", onlyAdmin: false },
        { title: "レンタル", name: "rentalBook", icon: "fas fa-fw fa-book", onlyAdmin: true },
        { title: "レンタル一覧", name: "rentalList", icon: "fas fa-fw fa-book", onlyAdmin: false },
        { title: "お知らせ管理", name: "informationManager", icon: "fas fa-fw fa-info-circle", onlyAdmin: true },
        { title: '学生用', name: 'student', icon: 'fas fa-fw fa-user', onlyAdmin: false }
      ].filter((e) => (!UserUtil.isAdmin() ? !e.onlyAdmin : true)),
    };
  },
  async mounted() {
    try {
      if (UserUtil.isSignIn()) {
        this.msg = "";
      } else {
        this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
};
</script>

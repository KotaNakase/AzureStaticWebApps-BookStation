<template>
  <div>
    <NaviMenu />

    <div id="wrapper">
      <Menu />

      <div id="content-wrapper" class="bg-light">
        <div class="container-fluid">
          <!-- パンくずリスト -->
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link tag="a" :to="{ name: 'menu' }">トップページ</router-link>
            </li>
            <li class="breadcrumb-item active">レンタル一覧</li>
          </ol>

          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <form @submit.stop.prevent="searchLendingBooks">
            <!-- Search Area -->
            <div id="searchArea" class="continer" style="font-size: 10pt">
              <div class="form-group m-2">
                <div class="px-2">ユーザーIDで検索</div>
                <div class="row">
                  <div class="col-lg-6">
                    <input
                      type="text"
                      id="searchWord"
                      class="form-control"
                      v-model="searchWord"
                      placeholder="入力してください"
                      required
                    />
                  </div>
                  <input class="btn-primary btn-sm" type="submit" value="検索" />
                </div>
              </div>
            </div>

            <!-- レンタル一覧 -->
            <b-table striped responsive hover :items="items" :fields="fields"></b-table>
          </form>
        </div>
      </div>
      <Footer />
    </div>

    <!-- スクロールトップボタン -->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fas fa-angle-up"></i>
    </a>

    <!-- ローディングマスク -->
    <loading v-if="isLoading === true" />
  </div>
</template>

<script>
import * as UserUtil from "@/utils/UserUtil";
import * as AjaxUtil from "@/utils/AjaxUtil";
// 共通
import NaviMenu from "../components/NaviMenu.vue";
import "../utils/sb-admin";
import Menu from "../components/Menu.vue";
import Footer from "../components/Footer.vue";
import Loading from "../components/Loading.vue";
export default {
  props: ["flashMsg", "flashErrMsg"],
  components: { NaviMenu, Menu, Footer, Loading },
  data() {
    return {
      msg: "",
      errMsg: "",
      userName: "",
      isLoading: false,
      fields: [
        { key: "book.title", label: "書籍名" },
        { key: "rental_date", label: "貸出日" },
        { key: "return_plan_date", label: "返却予定日" },
      ],
      items: [],
    };
  },
  async mounted() {
    try {
      if (UserUtil.isSignIn()) {
        this.msg = "";

        this.userName = UserUtil.currentUserInfo().userName;

        // 画面更新
        await this.updateView();
      } else {
        this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /**
     * 画面更新
     */
    updateView: async function () {
      // サインイン: 一般
      if (!UserUtil.isAdmin()) {
        // 検索エリアを非表示
        document.getElementById("searchArea").hidden = true;
        // 貸出状況検索処理呼び出し
        this.searchWord = UserUtil.currentUserInfo().userId;
        await this.searchLendingBooks();
      }
    },

    /**
     * 貸出状況検索処理
     */
    searchLendingBooks: async function () {
      this.isLoading = true;

      this.msg = "";
      this.errMsg = "";
      this.items = [];

      if (!this.searchWord || this.searchWord === "") {
        this.msg = "";
        this.errMsg = "検索条件を入力してください";
        this.isLoading = false;
        return;
      }

      // APIで検索
      try {
        const response = await AjaxUtil.searchLendingBooks(this.searchWord);
        this.items = JSON.parse(response.data.Items);

        if (this.items.length == 0) {
          this.msg = "該当データがありませんでした。";
        }
      } catch (e) {
        this.msg = "";
        this.errMsg = "検索に失敗しました";
        console.log(e);
      }

      this.isLoading = false;
    },
  },
};
</script>

<template>
  <div>
    <NaviMenu />

    <div id="wrapper">
      <Menu />

      <div id="content-wrapper" class="bg-light">
        <div class="container-fluid">
          <!-- パンくずリスト-->
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link tag="a" :to="{ name: 'top' }">トップページ</router-link>
            </li>
            <li class="breadcrumb-item active">学生用</li>
          </ol>

          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <b-table striped responsive hover :items="items" :fields="fields" />
        </div>
      </div>

      <Footer />
    </div>

    <!-- スクロールトップボタン-->
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
      isLoading: false,

      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "名前" },
      ],
      items: [],
    };
  },
  async mounted() {
    try {
      // サインイン確認
      if (UserUtil.isSignIn()) {
        // 画面更新
        await this.updateView();

        // メッセージ設定
        this.msg = this.flashMsg;
        this.errMsg = this.flashErrMsg;
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
      this.msg = "";
      this.errMsg = "";

      // 学生を検索する
      await this.getAllStudent();
    },
    /**
     * 学生検索
     */
    getAllStudent: async function () {
      this.isLoading = true;

      // 一覧を初期化する
      this.items = [];
      try {
        const response = await AjaxUtil.getAllStudent();
        for (const student of JSON.parse(response.data.Items)) {
          this.items.push({
            id: student.id,
            name: student.last_name + " " + student.first_name,
          });
        }
      } catch (e) {
        this.msg = "";
        this.errMsg = "学生検索に失敗しました";
        console.log(e);
      }

      this.isLoading = false;
    },
  },
};
</script>

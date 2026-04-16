<template>
  <div>
    <NaviMenu />

    <div id="wrapper">
      <Menu />

      <div id="content-wrapper" class="menu bg-light">
        <div class="container-fluid">
          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <!-- 図書館情報欄 -->
          <div class="d-flex align-items-stretch">
            <!-- 図書館イメージ -->
            <div>
              <img src="/public/image/library.png" class="img-fluid" />
            </div>
            <div>
              <img src="/public/image/title.png" class="img-fluid" />
            </div>
          </div>

          <br />

          <!-- お知らせ欄 -->
          <div class="card shadow mb-4">
            <form @submit.stop.prevent="menu">
              <div class="card-body">
                <b-table striped responsive hover :items="items" :fields="fields">
                  <!-- ボタンセル定義 -->
                  <template #cell(controls)="data">
                    <b-button-group>
                      <b-button
                        variant="outline-primary"
                        v-on:click="clickedRow = { title: data.item.title, text: data.item.content }"
                        data-toggle="modal"
                        data-target="#imagemodal"
                      >
                        詳細
                      </b-button>
                    </b-button-group>
                  </template>
                </b-table>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>

      <!-- モーダル -->
      <div
        class="modal fade"
        id="imagemodal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div
                class="modal-title m-0 font-weight-bold text-primary text-secondary"
                id="myModalLabel"
                v-show="clickedRow"
              >
                {{ clickedRow.title }}
              </div>
            </div>
            <div class="modal-body">
              <div class="multiline-text" v-show="clickedRow">{{ clickedRow.text }}</div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
                v-on:click="
                  clickedRow.title = '';
                  clickedRow.content = '';
                "
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- /modal -->
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
import Menu from "../components/Menu.vue";
import Footer from "../components/Footer.vue";
import Loading from "../components/Loading.vue";

export default {
  props: ["flashMsg"],
  components: { NaviMenu, Menu, Footer, Loading },
  data() {
    return {
      msg: this.flashMsg,
      errMsg: "",
      clickedRow: {},
      isLoading: false,
      fields: [
        { key: "date", label: "掲載日" },
        { key: "title", label: "お知らせ" },
        { key: "controls", label: "" },
      ],
      items: [],
    };
  },
  async mounted() {
    try {
      if (UserUtil.isSignIn()) {
        // 画面更新
        await this.updateView();
      } else {
        this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
    }
  },
  methods: {
    /**
     * 画面更新
     */
    updateView: async function () {
      this.msg = "";
      this.errMsg = "";

      // お知らせ取得
      await this.getInformation();
    },

    /**
     * お知らせ検索
     */
    getInformation: async function () {
      this.isLoading = true;

      // 一覧を初期化
      this.items = [];
      try {
        // お知らせを取得し、一覧に設定する
        const response = await AjaxUtil.getInformation();
        this.items = JSON.parse(response.data.Items);
      } catch (e) {
        this.msg = "";
        this.errMsg = "検索処理に失敗しました。";
        console.log(e);
      }

      this.isLoading = false;
    },
  },
};
</script>

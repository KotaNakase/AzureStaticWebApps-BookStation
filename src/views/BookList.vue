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
              <router-link tag="a" :to="{ name: 'top' }">トップページ</router-link>
            </li>
            <li class="breadcrumb-item active">書籍一覧</li>
          </ol>

          <!-- 書籍名による検索 -->
          <div class="continer" style="font-size: 10pt">
            <div class="form-group m-2">
              <div class="px-2">書籍名を検索</div>
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
                <button class="btn-primary btn-sm" v-on:click="searchBooks()">検索</button>
              </div>
            </div>
          </div>

          <hr />

          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <form @submit.stop.prevent="listbook">
            <div class="row">
              <div class="col-lg-6 mb-4" v-for="(row, key, index) in items" :key="index">
                <!-- Illustrations -->
                <div class="card shadow mb-4">
                  <div class="card-header py-3">
                    <div class="m-0 font-weight-bold text-primary text-secondary">{{ row.title }}</div>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-sm-2 mb-2 mr-1" style="min-width: 8rem">
                        <div class="row text-left ml-2 mb-3">
                          <img
                            style="height: 7rem; width: 7rem"
                            v-if="row.img_url === undefinded || row.img_url === null || row.img_url === ''"
                            src="../../public/image/no-image.png"
                          />
                          <a
                            href="#"
                            onclick="return false;"
                            v-if="row.img_url !== undefinded && row.img_url !== null && row.img_url !== ''"
                          >
                            <img
                              style="height: 10rem"
                              v-bind:src="row.img_url"
                              alt=""
                              v-on:click="
                                clickedRow = { title: row.title, img_url: row.img_url, description: row.description }
                              "
                              data-toggle="modal"
                              data-target="#imagemodal"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
              <img v-bind:src="clickedRow.img_url" id="imagepreview" class="img-responsive" />
              <div class="mt-4 mb-2">概要</div>
              <div class="multiline-text" v-if="clickedRow.description !== 'null'" v-show="clickedRow">
                {{ clickedRow.description }}
              </div>
              <div class="multiline-text" v-else>情報がありません。</div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-default"
                data-dismiss="modal"
                v-on:click="
                  clickedRow.img_url = '';
                  clickedRow.description = '';
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
      items: [],
      userName: "",
      clickedRow: {},
      isLoading: false,
    };
  },
  async mounted() {
    try {
      if (UserUtil.isSignIn()) {
        this.msg = "";
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
      // 画面更新
      this.isLoading = true;

      try {
        const response = await AjaxUtil.getAllSapBooks();
        this.items = JSON.parse(response.data.Items);
      } catch (e) {
        this.msg = "";
        this.errMsg = "検索に失敗しました";
        console.log(e);
      }

      this.isLoading = false;
    },
    searchBooks: async function () {
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

      // 画面更新
      this.isLoading = true;

      try {
        const response = await AjaxUtil.getAllSearchBooks(this.searchWord);
        this.items = JSON.parse(response.data.Items);
      } catch (e) {
        this.msg = "";
        this.errMsg = "書籍検索に失敗しました 管理者にお問い合わせください";
        console.log(e);
      }

      this.isLoading = false;
    },
  },
};
</script>

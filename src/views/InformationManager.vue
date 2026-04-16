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
            <li class="breadcrumb-item active">お知らせ管理</li>
          </ol>

          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <!-- お知らせ欄 -->
          <div class="card shadow mb-4">
            <div class="card-header d-flex align-items-center justify-content-between">
              <!-- お知らせ一覧タイトル -->
              <div class="font-weight-bold">お知らせ一覧</div>
              <!-- 新規登録ボタン -->
              <button
                type="button"
                class="btn btn-primary"
                @click="
                  () => {
                    reg = regType.create;
                    beforeCreateModal({});
                  }
                "
                data-toggle="modal"
                data-target="#modal"
              >
                新規登録
              </button>
            </div>
            <!-- お知らせ一覧テーブル -->
            <div class="card-body">
              <div class="table-responsive">
                <b-table :items="items" :fields="fields">
                  <!-- ボタンセル定義 -->
                  <template #cell(update)="data">
                    <!-- 編集ボタン -->
                    <b-button
                      class="minWidth"
                      variant="outline-primary"
                      @click="
                        () => {
                          reg = regType.update;
                          beforeCreateModal(data.item);
                        }
                      "
                      data-toggle="modal"
                      data-target="#modal"
                    >
                      編集
                    </b-button>
                  </template>
                  <template #cell(delete)="data">
                    <!-- 削除ボタン -->
                    <b-button
                      class="minWidth"
                      variant="outline-danger"
                      @click="
                        () => {
                          reg = regType.delete;
                          beforeCreateModal(data.item);
                        }
                      "
                      data-toggle="modal"
                      data-target="#modal"
                    >
                      削除
                    </b-button>
                  </template>
                </b-table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <!-- モーダル -->
      <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title m-0 font-weight-bold text-primary text-secondary">
                <label v-if="reg === regType.create">以下の内容でお知らせを登録してよろしいですか？</label>
                <label v-if="reg === regType.update">以下の内容でお知らせを更新してよろしいですか？</label>
                <label v-if="reg === regType.delete">以下のお知らせを削除してよろしいですか？</label>
              </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p class="text-danger" v-show="errMsgModal">{{ errMsgModal }}</p>

              <!-- 番号 -->
              <b-row v-if="reg !== regType.create" class="mt-2">
                <b-col sm="3">
                  <label for="textarea-default">番号</label>
                </b-col>
                <b-col sm="9">
                  <label for="textarea-default">{{ no }}</label>
                </b-col>
              </b-row>

              <!-- 掲載日 -->
              <b-row v-if="reg !== regType.create" class="mt-2">
                <b-col sm="3">
                  <label for="textarea-default">掲載日</label>
                </b-col>
                <b-col sm="9">
                  <label for="textarea-default">{{ date }}</label>
                </b-col>
              </b-row>

              <!-- タイトル -->
              <b-row class="mt-2">
                <b-col sm="3">
                  <label for="textarea-default">タイトル</label>
                </b-col>
                <b-col sm="9">
                  <label v-if="reg === regType.delete" for="textarea-default">{{ title }}</label>
                  <b-form-textarea
                    v-if="reg !== regType.delete"
                    v-model="title"
                    autocomplete="off"
                    size="sm"
                    max-rows="5"
                    no-resize
                    class="overflow-hidden"
                  >
                  </b-form-textarea>
                </b-col>
              </b-row>

              <!-- 詳細 -->
              <b-row class="mt-2">
                <b-col sm="3">
                  <label for="textarea-default">詳細</label>
                </b-col>
                <b-col sm="9">
                  <label v-if="reg === regType.delete" for="textarea-default">{{ content }}</label>
                  <b-form-textarea
                    v-if="reg !== regType.delete"
                    v-model="content"
                    autocomplete="off"
                    size="sm"
                    max-rows="5"
                    no-resize
                    class="overflow-hidden"
                  >
                  </b-form-textarea>
                </b-col>
              </b-row>
            </div>
            <div class="modal-footer">
              <button
                v-if="reg === regType.create"
                id="addButton"
                type="button"
                class="btn btn-primary"
                @click="addInformation()"
              >
                登録
              </button>
              <button
                v-if="reg === regType.update"
                id="updateButton"
                type="button"
                class="btn btn-primary"
                @click="updateInformation()"
              >
                更新
              </button>
              <button
                v-if="reg === regType.delete"
                id="deleteButton"
                type="button"
                class="btn btn-danger"
                @click="deleteInformation()"
              >
                削除
              </button>

              <button id="cancelButton" type="button" class="btn btn-secondary" data-dismiss="modal">キャンセル</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- スクロールトップボタン-->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fas fa-angle-up"></i>
    </a>

    <!-- ローディングマスク -->
    <loading v-if="isLoading === true" />
  </div>
</template>

<style>
.minWidth {
  min-width: 60px;
}
</style>

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
      errMsgModal: "",
      isLoading: false,
      fields: [
        { key: "no", label: "番号", class: "minWidth" },
        { key: "date", label: "掲載日" },
        { key: "title", label: "タイトル" },
        { key: "update", label: "", class: "text-center" },
        { key: "delete", label: "", class: "text-center" },
      ],
      items: [],

      // 登録種別
      reg: 0,
      regType: {
        create: 1, // 作成
        update: 2, // 更新
        delete: 3, // 削除
      },

      // 各項目初期値
      no: "",
      date: "",
      title: "",
      content: "",
    };
  },
  async mounted() {
    try {
      // サインインチェック
      if (UserUtil.isSignIn() && UserUtil.isAdmin()) {
        // メッセージ初期化
        this.msg = "";
        this.errMsg = "";

        // お知らせを検索
        this.isLoading = true;
        await this.getInformation();
        this.isLoading = false;
      } else {
        // サインイン画面に遷移
        this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },
  methods: {
    /**
     * お知らせ検索
     */
    getInformation: async function () {
      // 一覧の初期化
      this.items = [];

      try {
        // 検索処理
        const response = await AjaxUtil.getInformation();
        this.items = JSON.parse(response.data.Items);
      } catch (e) {
        this.errMsg = "検索処理に失敗しました";
      }
    },

    /**
     * モーダル作成前処理
     *
     * @param information お知らせ情報
     */
    beforeCreateModal: function (information) {
      // モーダルメッセージの初期化
      this.errMsgModal = "";

      // モーダルの各項目に値を設定
      this.no = information.no;
      this.date = information.date;
      this.title = information.title;
      this.content = information.content;
    },

    /**
     * お知らせ入力値をチェック
     */
    checkInformation: function () {
      if (!this.title) {
        this.errMsgModal = "タイトルを入力してください";
        return false;
      }

      if (this.title.length > 100) {
        this.errMsgModal = "タイトルは100桁以下で入力してください";
        return false;
      }

      if (!this.content) {
        this.errMsgModal = "詳細を入力してください";
        return false;
      }

      if (this.content.length > 100) {
        this.errMsgModal = "詳細は100桁以下で入力してください";
        return false;
      }
      return true;
    },

    /**
     * お知らせ追加
     */
    addInformation: async function () {
      // メッセージの初期化
      this.msg = "";
      this.errMsg = "";

      // 入力チェック
      if (!this.checkInformation()) {
        return;
      }

      this.isLoading = true;

      // モーダルを閉じる
      $("#modal").modal("hide");

      try {
        // 新規登録処理
        await AjaxUtil.postInformation({ title: this.title, content: this.content });

        // 一覧を再検索
        await this.getInformation();

        this.msg = "登録に成功しました";
      } catch (e) {
        this.errMsg = "登録に失敗しました";
        console.log(e);
      }

      this.isLoading = false;
    },

    /**
     * お知らせ更新
     */
    updateInformation: async function () {
      // メッセージの初期化
      this.msg = "";
      this.errMsg = "";

      // 入力チェック
      if (!this.checkInformation()) {
        this.isLoading = false;
        return;
      }

      this.isLoading = true;

      // モーダルを閉じる
      $("#modal").modal("hide");

      try {
        // 更新処理
        await AjaxUtil.putInformation({
          no: this.no,
          title: this.title,
          content: this.content,
        });

        // 一覧を再検索
        await this.getInformation();

        this.msg = "更新に成功しました";
      } catch (e) {
        this.errMsg = "更新に失敗しました";
        console.log(e);
      }

      this.isLoading = false;
    },

    /**
     * お知らせ削除
     */
    deleteInformation: async function () {
      // メッセージの初期化
      this.msg = "";
      this.errMsg = "";

      this.isLoading = true;

      // モーダルを閉じる
      $("#modal").modal("hide");

      try {
        // 削除処理
        await AjaxUtil.deleteInformation(this.no);

        // 一覧を再検索
        await this.getInformation();

        this.msg = "削除に成功しました";
      } catch (e) {
        this.errMsg = "削除に失敗しました";
        console.log(e);
      }

      this.isLoading = false;
    },
  },
};
</script>

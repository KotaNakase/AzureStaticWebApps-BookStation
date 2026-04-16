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
            <li class="breadcrumb-item active">レンタル</li>
          </ol>

          <!-- 書籍名検索 -->
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

          <!-- ユーザーID入力欄 -->
          <div class="continer" style="font-size: 10pt">
            <div class="form-group m-2">
              <div class="px-2">貸出 / 返却するユーザーID</div>
              <div class="row">
                <div class="col-lg-6">
                  <input
                    type="text"
                    id="registId"
                    class="form-control"
                    placeholder="入力してください"
                    required="required"
                    v-model="registId"
                    autocomplete="off"
                  />
                </div>
              </div>
            </div>
          </div>

          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <form @submit.stop.prevent="rentalbook">
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

                      <div class="col-sm-8 ml-2 mb-2 text-left" v-if="isLoading === false">
                        <div class="row ml-2 mb-2" v-if="isLoading === false">
                          <a href="#" class="font-weight-bold text-info" v-on:click="rental(row.isbn, row.book_id)">
                            <i class="fas fa-fw fa-file-export"></i>
                            <span>貸出&nbsp;</span>
                          </a>
                          <a
                            href="#"
                            class="font-weight-bold text-primary"
                            v-on:click="returnBook(row.isbn, row.book_id)"
                          >
                            <i class="fas fa-fw fa-file-import"></i>
                            <span>返却&nbsp;</span>
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

        this.userName = UserUtil.currentUserInfo().userName;

        // 画面更新
        this.updateView();
      } else {
        this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
      }
    } catch (e) {
      this.errMsg = e.message;
    }
  },

  methods: {
    /**
     * 書籍検索
     */
    searchBooks: function () {
      this.isLoading = true;

      this.msg = "";
      this.errMsg = "";
      this.items = [];

      if (!this.searchWord || this.searchWord === "") {
        this.msg = "";
        this.errMsg = "検索条件を入力してください";
        this.isLoading = false;
        // 画面更新
        this.updateView();
        return;
      }

      AjaxUtil.getAllSearchBooks(this.searchWord)
        .then((response) => {
          this.items = JSON.parse(response.data.Items);
        })
        .catch((error) => {
          this.msg = "";
          this.errMsg = "書籍検索に失敗しました 管理者にお問い合わせください";
          console.log(error);
        })
        .then(() => {
          this.isLoading = false;
        });
    },

    /**
     * レンタル処理
     * @param isbn
     * @param book_id
     */
    rental: function (isbn, book_id) {
      if (this.registId === undefined) {
        this.msg = "";
        this.errMsg = "ユーザーIDを入力してください";
        return;
      }

      const alreadyModel = {
        isbn: isbn,
        lending_user_id: this.registId,
      };

      // ユーザーID存在チェック → 貸出チェック → 貸出登録
      AjaxUtil.getUserById(this.registId)
        .then((response) => {
          const result = response.data;
          if (result === "") {
            this.msg = "";
            this.errMsg = "登録されていないユーザーIDです";
            this.isLoading = false;
          }
          return result;
        })
        .catch((error) => {
          this.msg = "";
          this.errMsg = "ユーザーID確認に失敗しました 管理者にお問い合わせください";
          console.log(error);
          return true;
        })
        .then((notUserId) => {
          if (!notUserId) {
            return;
          }

          // 貸出チェック
          AjaxUtil.alreadyLending(alreadyModel)
            .then((response) => {
              const result = response.data.length > 0;
              if (result) {
                this.msg = "";
                this.errMsg = "既に書籍を貸出しております";
                this.isLoading = false;
              }
              return result;
            })
            .catch((error) => {
              this.msg = "";
              this.errMsg = "貸出状況確認に失敗しました 管理者にお問い合わせください";
              console.log(error);
              return true;
            })
            .then((isAlready) => {
              if (isAlready) {
                return;
              }

              if (UserUtil.isSignIn()) {
                this.isLoading = true;

                // 貸出日計算
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                if (month == 13) {
                  month = 1;
                }
                var day = now.getDate() + 1;

                // 返却予定日計算
                var returnPlanDay = new Date();
                returnPlanDay.setDate(returnPlanDay.getDate() + 14);
                var returnYear = returnPlanDay.getFullYear();
                var returnMonth = returnPlanDay.getMonth() + 1;
                if (month == 13) {
                  month = 1;
                }
                var returnDay = returnPlanDay.getDate() + 1;

                // 引数格納
                const model = {
                  book_id: book_id,
                  isbn: isbn,
                  lending_user_id: this.registId,
                  rental_date: year + "/" + month + "/" + day,
                  return_plan_date: returnYear + "/" + returnMonth + "/" + returnDay,
                  managed_user_id: UserUtil.currentUserInfo().userId,
                };

                // 貸出登録実行
                AjaxUtil.postLending(model)
                  .then((response) => {
                    this.msg = "貸出登録を行いました";
                    this.errMsg = "";
                    this.updateView();
                  })
                  .catch((error) => {
                    this.msg = "";
                    this.errMsg = "貸出に失敗しました 管理者にお問い合わせください";
                    console.log(error);
                    this.isLoading = false;
                  });
              } else {
                this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
              }
            });
        });
    },

    /**
     * 返却処理
     *
     * @param isbn
     * @param book_id
     */
    returnBook: function (isbn, book_id) {
      if (this.registId === undefined) {
        this.msg = "";
        this.errMsg = "ユーザーIDを入力してください";
        return;
      }

      const alreadyModel = {
        isbn: isbn,
        lending_user_id: this.registId,
      };

      // 返却チェック → 返却処理
      AjaxUtil.alreadyLending(alreadyModel)
        .then((response) => {
          const result = response.data.length < 1;
          if (result) {
            this.msg = "";
            this.errMsg = "書籍を貸出しておりません";
            this.isLoading = false;
          }
          return result;
        })
        .catch((error) => {
          this.msg = "";
          this.errMsg = "貸出状況確認に失敗しました 管理者にお問い合わせください";
          console.log(error);
          return true;
        })
        .then((isAlready) => {
          if (isAlready) {
            return;
          }

          if (UserUtil.isSignIn()) {
            this.isLoading = true;

            // 引数格納
            const model = {
              book_id: book_id,
              isbn: isbn,
              lending_user_id: this.registId,
            };

            AjaxUtil.deleteLending(model)
              .then((response) => {
                this.errMsg = "";
                this.msg = "返却を行いました";
                this.updateView();
              })
              .catch((error) => {
                this.msg = "";
                this.errMsg = "返却に失敗しました 管理者にお問い合わせください";
                console.log(error);
                this.isLoading = false;
              });
          } else {
            this.$router.push({ name: "signIn", params: { flashMsg: "サインインしてください" } });
          }
        });
    },

    /**
     * 画面更新
     */
    updateView: function () {
      this.isLoading = true;

      AjaxUtil.getAllSapBooks()
        .then((response) => {
          this.items = JSON.parse(response.data.Items);
        })
        .catch((error) => {
          this.msg = "";
          this.errMsg = "書籍検索に失敗しました 管理者にお問い合わせください";
          console.log(error);
        })
        .then(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

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
            <li class="breadcrumb-item active">ユーザー追加</li>
          </ol>

          <p class="text-primary" v-show="msg">{{ msg }}</p>
          <p class="text-danger" v-show="errMsg">{{ errMsg }}</p>

          <br />

          <form @submit.stop.prevent="userCreate" method="post">
            <div class="row">
              <div class="col" />
              <div class="col-6">
                <!-- ユーザーID -->
                <div class="form-group">
                  <label>ユーザーID</label>
                  <input
                    type="text"
                    id="userId"
                    class="form-control"
                    placeholder="1桁以上16桁以下で入力してください"
                    v-model="userId"
                    autocomplete="off"
                  />
                </div>
                <!-- ユーザー名 -->
                <div class="form-group">
                  <label>ユーザー名</label>
                  <input
                    type="text"
                    id="userName"
                    class="form-control"
                    placeholder="100桁以下で入力してください"
                    v-model="userName"
                    autocomplete="off"
                  />
                </div>
                <!-- パスワード -->
                <div class="form-group">
                  <label>パスワード</label>
                  <input
                    type="password"
                    id="inputPassword"
                    class="form-control"
                    placeholder="8桁以上16桁以下で入力してください"
                    v-model="password"
                  />
                </div>
                <!-- パスワード(再入力) -->
                <div class="form-group">
                  <label>パスワード(再入力)</label>
                  <input
                    type="password"
                    id="inputReenterPassword"
                    class="form-control"
                    placeholder="8桁以上16桁以下で入力してください"
                    v-model="reenterPassword"
                  />
                </div>
                <!-- 性別 -->
                <div class="form-group">
                  <label>性別</label>
                  <br />
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="womanRadio"
                      name="genderRadio"
                      class="custom-control-input"
                      v-model="gender"
                      v-bind:value="woman"
                      checked
                    />
                    <label class="custom-control-label" for="womanRadio">女性</label>
                  </div>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="manRadio"
                      name="genderRadio"
                      class="custom-control-input"
                      v-model="gender"
                      v-bind:value="man"
                    />
                    <label class="custom-control-label" for="manRadio">男性</label>
                  </div>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="unknownRadio"
                      name="genderRadio"
                      class="custom-control-input"
                      v-model="gender"
                      v-bind:value="unknown"
                    />
                    <label class="custom-control-label" for="unknownRadio">非公開</label>
                  </div>
                </div>
                <!-- 権限 -->
                <div class="form-group">
                  <label>権限</label>
                  <br />
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="generalRadio"
                      name="authRadio"
                      class="custom-control-input"
                      v-model="auth"
                      v-bind:value="general"
                      checked
                    />
                    <label class="custom-control-label" for="generalRadio">一般</label>
                  </div>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="adminRadio"
                      name="authRadio"
                      class="custom-control-input"
                      v-model="auth"
                      v-bind:value="admin"
                    />
                    <label class="custom-control-label" for="adminRadio">社員</label>
                  </div>
                </div>
                <!-- 住所 -->
                <div class="form-group">
                  <label>住所</label>
                  <input
                    type="text"
                    id="address"
                    class="form-control"
                    placeholder="150桁以下で入力してください"
                    v-model="address"
                    autocomplete="off"
                  />
                </div>
                <!-- 新規登録ボタン -->
                <div class="form-group">
                  <div class="d-flex justify-content-md-center">
                    <input class="btn btn-primary btn-block w-50" type="submit" value="新規登録" />
                  </div>
                </div>
              </div>
              <div class="col" />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>

    <!-- トップにスクロール -->
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
import UserConst from "@/utils/const/UserConst";
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
      isLoading: false,
      // 各項目初期値
      userId: "",
      userName: "",
      password: "",
      reenterPassword: "",
      address: "",
      gender: UserConst.Gender.woman,
      auth: UserConst.Auth.general,
      // 各ラジオボタン設定値
      man: UserConst.Gender.man,
      woman: UserConst.Gender.woman,
      unknown: UserConst.Gender.unknown,
      general: UserConst.Auth.general,
      admin: UserConst.Auth.admin,
    };
  },
  async mounted() {
    // サインイン確認
    try {
      if (UserUtil.isSignIn()) {
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
     * ユーザー作成
     */
    userCreate: async function () {
      this.isLoading = true;

      try {
        // 入力チェック
        if (this.userId == null || this.userId === "") {
          this.errMsg = "ユーザーIDを入力してください";
          return;
        }
        if (this.userId.length > 16) {
          this.errMsg = "ユーザーIDは16桁以下で入力してください";
          return;
        }
        if (!this.userId.match("^[0-9A-Za-z]*$")) {
          this.errMsg = "ユーザーIDは半角英数で入力してください";
          return;
        }
        if (this.userName == null || this.userName === "") {
          this.errMsg = "ユーザー名を入力してください";
          return;
        }
        if (this.userName.length > 100) {
          this.errMsg = "ユーザー名は100桁以下で入力してください";
          return;
        }
        if (this.password == null || this.password === "") {
          this.errMsg = "パスワードを入力してください";
          return;
        }
        if (this.password.length < 8 || this.password.length > 16) {
          this.errMsg = "パスワードは8桁以上16桁以下で入力してください";
          return;
        }
        if (!this.password.match("^[0-9A-Za-z]*$")) {
          this.errMsg = "パスワードは半角英数で入力してください";
          return;
        }
        if (this.password !== this.reenterPassword) {
          this.errMsg = "パスワードとパスワード(再入力)が一致しません。";
          return;
        }
        if (this.gender == null || this.gender === "") {
          this.errMsg = "性別を選択してください";
          return;
        }
        if (this.auth == null || this.auth === "") {
          this.errMsg = "権限を選択してください";
          return;
        }
        // 住所の入力チェック
        if (this.address != null && this.address !== "" && this.address.length > 150) {
          this.errMsg = "住所は150桁以下で入力してください";
          return;
        }

        // ユーザーID重複チェック
        const response = await AjaxUtil.getUserById(this.userId);
        const userInfo = JSON.parse(response.data.Items);
        if (userInfo) {
          this.errMsg = "入力されたユーザーは既に登録されています";
          return;
        }

        // 引数格納
        const model = {
          userId: this.userId,
          userName: this.userName,
          password: this.password,
          gender: this.gender,
          auth: this.auth,
          address: this.address,
        };

        // 登録
        await AjaxUtil.postUser(model);

        // 一覧画面に遷移する
        this.$router.push({ name: "userList", params: { flashMsg: "登録に成功しました" } });
      } catch (e) {
        this.msg = "";
        this.errMsg = "ユーザー登録に失敗しました";
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

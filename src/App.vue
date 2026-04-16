<template>
  <div>
    <button class="btn-primary btn-sm" v-on:click="goToSignIn()">サインインへ</button>
    <!-- ルーターによって各ページコンポーネントがここに描画される -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    /**
     * サインインページへ遷移
     */
    goToSignIn() {
      this.$router.push({ name: "signIn" }).catch(err => {
        // NavigationDuplicated エラーのみ無視する
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });
    },
  },
};
</script>

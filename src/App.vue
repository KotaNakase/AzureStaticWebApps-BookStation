<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  async mounted() {
    // エントリーポイントから自動的にサインイン画面に遷移
    this.$router.push({ name: "signIn", params: { flashMsg: "" } });
  }
};
</script>

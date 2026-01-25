<template>
  <div>
    <div>
      <b-table striped responsive hover :items="items" :fields="fields" />
    </div>
    <button class="btn-primary btn-sm" v-on:click="signIn()">test</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      items: [],
      body: "",
      fields: [
        { key: "id", label: "ID" },
        { key: "title", label: "タイトル" },
        { key: "content", label: "内容" },
      ],
    };
  },
  async mounted() {
    const response = await fetch("/api/dataaccess");
    this.body = await response.json();
    for (let item of this.body) {
      this.items.push({
        id: item.ID,
        title: item.Title,
        content: item.Content,
      });
    }
  },
      async signIn() {
        this.$router.push({ name: "signIn" });
    //   this.msg = "";
    //   this.errMsg = "";

    //   this.isLoading = true;

    //   try {
    //     await UserUtil.signIn(this.userId, this.password);
    //     this.$router.push({ name: "top" });
    //   } catch (e) {
    //     if (e.response.status === 401) {
    //       this.errMsg = "サインインに失敗しました";
    //     } else {
    //       this.errMsg = e.message;
    //     }
    //   } finally {
    //     this.isLoading = false;
    //   }
    },
};
</script>

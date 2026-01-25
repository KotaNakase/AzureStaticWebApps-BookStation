module.exports = {
  publicPath: "/public",
  outputDir: "dist",
  assetsDir: "assets",
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: true,
  css: {
    modules: false,
    extract: true,
    sourceMap: true,
  },
  lintOnSave: true,
  pages: {
    signIn: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/sign-in.html",
      title: "サインイン",
    },
    // signOut: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/sign-out.html",
    //   title: "サインアウト",
    // },
    top: {
      entry: "src/main.js",
      template: "public/pages/index.html",
      filename: "pages/top.html",
      title: "トップページ",
    },
    // bookList: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/book/list.html",
    //   title: "書籍一覧",
    // },
    // bookManager: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/book/manager.html",
    //   title: "書籍管理",
    // },
    // userList: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/user/list.html",
    //   title: "ユーザー一覧",
    // },
    // userCreate: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/user/create.html",
    //   title: "ユーザー追加",
    // },
    // userManager: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/user/manager.html",
    //   title: "ユーザー管理",
    // },
    // rentalBook: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/book/rental.html",
    //   title: "レンタル",
    // },
    // rentalList: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/book/rental/list.html",
    //   title: "レンタル一覧",
    // },
    // student: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/student.html",
    //   title: "学生課題",
    // },
    // informationManager: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/information/manager.html",
    //   title: "お知らせ管理",
    // },
    // sorry: {
    //   entry: "src/main.js",
    //   template: "public/pages/index.html",
    //   filename: "pages/sorry.html",
    //   title: "Sorry",
    // },
  },
  // devServer: {
  //   port: 8080,
  //   proxy: {
  //     "/api": {
  //       target: "http://api:3000",
  //       changeOrigin: true,
  //     },
  //   },
  //     watchOptions: {
  //     ignored: /node_modules/,
  //     poll: true
  //   }
  // },
};

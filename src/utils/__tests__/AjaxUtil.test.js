import {
  postSignIn,
  getUser,
  getUserByAuth,
  getUserById,
  postUser,
  putUser,
  deleteUser,
  getAllSapBooks,
  getAllSearchBooks,
  getInformation,
} from "../AjaxUtil";

// fetch のモックヘルパー
const mockFetch = (ok, data, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
  });
};

describe("AjaxUtil", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  // ─────────────────────────────────────────────
  // request 関数の共通動作
  // ─────────────────────────────────────────────
  describe("共通: レスポンスが ok でない場合", () => {
    it("404 のとき Error をスロー", async () => {
      mockFetch(false, null, 404);
      await expect(getUserById("u1")).rejects.toThrow("API エラー: 404");
    });

    it("スローされたエラーに response.status が含まれる", async () => {
      mockFetch(false, null, 500);
      try {
        await getUserById("u1");
      } catch (e) {
        expect(e.response.status).toBe(500);
      }
    });
  });

  // ─────────────────────────────────────────────
  // クエリパラメータ構築
  // ─────────────────────────────────────────────
  describe("共通: クエリパラメータ", () => {
    it("params が null のとき URL に ? が付かない", async () => {
      mockFetch(true, []);
      await getAllSapBooks();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/books",
        expect.any(Object),
      );
    });

    it("undefined / null の値はクエリから除外される", async () => {
      mockFetch(true, []);
      await getUser({ userId: "u1", userName: undefined, address: null });
      const calledUrl = global.fetch.mock.calls[0][0];
      expect(calledUrl).toBe("/api/users?userId=u1");
    });

    it("複数パラメータが正しく結合される", async () => {
      mockFetch(true, []);
      await getUser({ userId: "u1", userName: "taro" });
      const calledUrl = global.fetch.mock.calls[0][0];
      expect(calledUrl).toBe("/api/users?userId=u1&userName=taro");
    });
  });

  // ─────────────────────────────────────────────
  // サインイン
  // ─────────────────────────────────────────────
  describe("postSignIn", () => {
    it("POST /api/signin にリクエストを送り data を返す", async () => {
      const payload = { userId: "user1", password: "pass" };
      mockFetch(true, { token: "abc" });

      const result = await postSignIn(payload);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/signin",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }),
      );
      expect(result).toEqual({ data: { token: "abc" } });
    });
  });

  // ─────────────────────────────────────────────
  // ユーザー関連
  // ─────────────────────────────────────────────
  describe("getUser", () => {
    it("GET /api/users にクエリパラメータ付きでリクエスト", async () => {
      mockFetch(true, []);
      await getUser({ userId: "u1" });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users?userId=u1",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("getUserByAuth", () => {
    it("GET /api/users?auth=xxx でリクエスト", async () => {
      mockFetch(true, []);
      await getUserByAuth("admin");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users?auth=admin",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("getUserById", () => {
    it("GET /api/users/:id でリクエスト", async () => {
      mockFetch(true, { userId: "u1" });
      const result = await getUserById("u1");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users/u1",
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual({ data: { userId: "u1" } });
    });
  });

  describe("postUser", () => {
    it("POST /api/users にリクエスト", async () => {
      const model = { userId: "u2", userName: "jiro" };
      mockFetch(true, { ok: true });
      await postUser(model);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(model),
        }),
      );
    });
  });

  describe("putUser", () => {
    it("PUT /api/users にリクエスト", async () => {
      const model = { userId: "u2", userName: "jiro-updated" };
      mockFetch(true, { ok: true });
      await putUser(model);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users",
        expect.objectContaining({ method: "PUT" }),
      );
    });
  });

  describe("deleteUser", () => {
    it("DELETE /api/users/:id でリクエスト", async () => {
      mockFetch(true, { ok: true });
      await deleteUser("u2");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users/u2",
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  // ─────────────────────────────────────────────
  // 書籍関連
  // ─────────────────────────────────────────────
  describe("getAllSapBooks", () => {
    it("GET /api/books でリクエスト", async () => {
      mockFetch(true, []);
      await getAllSapBooks();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/books",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("getAllSearchBooks", () => {
    it("GET /api/books/search?word=xxx でリクエスト", async () => {
      mockFetch(true, []);
      await getAllSearchBooks("vue");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/books/search?word=vue",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  // ─────────────────────────────────────────────
  // お知らせ関連
  // ─────────────────────────────────────────────
  describe("getInformation", () => {
    it("GET /api/information でリクエスト", async () => {
      mockFetch(true, []);
      await getInformation();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/information",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });
});

/**
 * Ajax ユーティリティ
 * fetch を axios レスポンス形式 ({ data: ... }) でラップする
 */
const BASE_URL = "/api";
/**
 * fetch ラッパー（axios 互換レスポンスを返す）
 * @param {string} method HTTP メソッド
 * @param {string} url エンドポイント URL
 * @param {object|null} body リクエストボディ
 * @param {object} params クエリパラメータ
 * @returns {Promise<{ data: any }>}
 */
const request = async (method, url, body = null, params = null) => {
  let fullUrl = url;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    ).toString();
    if (query) fullUrl += `?${query}`;
  }
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(fullUrl, options);
  if (!response.ok) {
    const error = new Error(`API エラー: ${response.status}`);
    error.response = { status: response.status };
    throw error;
  }
  const data = await response.json();
  return { data };
};
// ─────────────────────────────────────────────
// サインイン
// ─────────────────────────────────────────────
/**
 * サインイン
 * @param {{ userId: string, password: string }} params
 */
export const postSignIn = (params) =>
  request("POST", `${BASE_URL}/signin`, params);
// ─────────────────────────────────────────────
// ユーザー関連
// ─────────────────────────────────────────────
/**
 * ユーザー検索（あいまい検索）
 * @param {{ userId?: string, userName?: string, address?: string }} params
 */
export const getUser = (params) =>
  request("GET", `${BASE_URL}/users`, null, params);
/**
 * 権限でユーザー検索
 * @param {string} auth
 */
export const getUserByAuth = (auth) =>
  request("GET", `${BASE_URL}/users`, null, { auth });
/**
 * ユーザーIDでユーザー取得
 * @param {string} userId
 */
export const getUserById = (userId) =>
  request("GET", `${BASE_URL}/users/${userId}`);
/**
 * ユーザー登録
 * @param {{ userId: string, userName: string, password: string, gender: string, auth: string, address: string }} model
 */
export const postUser = (model) =>
  request("POST", `${BASE_URL}/users`, model);
/**
 * ユーザー更新
 * @param {{ userId: string, userName: string, password: string, gender: string, auth: string, address: string }} model
 */
export const putUser = (model) =>
  request("PUT", `${BASE_URL}/users`, model);
/**
 * ユーザー削除
 * @param {string} userId
 */
export const deleteUser = (userId) =>
  request("DELETE", `${BASE_URL}/users/${userId}`);
// ─────────────────────────────────────────────
// 書籍関連
// ─────────────────────────────────────────────
/**
 * 全書籍取得（マスタ）
 */
export const getAllSapBooks = () =>
  request("GET", `${BASE_URL}/books`);
/**
 * 書籍検索（マスタ）
 * @param {string} searchWord
 */
export const getAllSearchBooks = (searchWord) =>
  request("GET", `${BASE_URL}/books/search`, null, { word: searchWord });
/**
 * 書籍検索（Google Books API 経由）
 * @param {string} searchWord
 */
export const searchBooks = (searchWord) =>
  request("GET", `${BASE_URL}/books/google`, null, { word: searchWord });
/**
 * 書籍追加
 * @param {{ isbn: string, title: string, book_id: string, description: string, img_url: string }} model
 */
export const addBook = (model) =>
  request("POST", `${BASE_URL}/books`, model);
/**
 * 書籍削除
 * @param {string} title
 */
export const deleteBook = (title) =>
  request("DELETE", `${BASE_URL}/books`, { title });
// ─────────────────────────────────────────────
// レンタル関連
// ─────────────────────────────────────────────
/**
 * 貸出状況確認
 * @param {{ isbn: string, lending_user_id: string }} model
 */
export const alreadyLending = (model) =>
  request("POST", `${BASE_URL}/lending/check`, model);
/**
 * 貸出登録
 * @param {{ book_id: string, isbn: string, lending_user_id: string, rental_date: string, return_plan_date: string, managed_user_id: string }} model
 */
export const postLending = (model) =>
  request("POST", `${BASE_URL}/lending`, model);
/**
 * 返却処理
 * @param {{ book_id: string, isbn: string, lending_user_id: string }} model
 */
export const deleteLending = (model) =>
  request("DELETE", `${BASE_URL}/lending`, model);
/**
 * 貸出状況検索
 * @param {string} userId
 */
export const searchLendingBooks = (userId) =>
  request("GET", `${BASE_URL}/lending`, null, { userId });
// ─────────────────────────────────────────────
// お知らせ関連
// ─────────────────────────────────────────────
/**
 * お知らせ取得
 */
export const getInformation = () =>
  request("GET", `${BASE_URL}/information`);
/**
 * お知らせ登録
 * @param {{ title: string, content: string }} data
 */
export const postInformation = (data) =>
  request("POST", `${BASE_URL}/information`, data);
/**
 * お知らせ更新
 * @param {{ no: string, title: string, content: string }} data
 */
export const putInformation = (data) =>
  request("PUT", `${BASE_URL}/information`, data);
/**
 * お知らせ削除
 * @param {string} no
 */
export const deleteInformation = (no) =>
  request("DELETE", `${BASE_URL}/information/${no}`);
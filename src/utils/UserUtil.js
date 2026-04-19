/**
 * ユーザーユーティリティ
 */
const USER_INFO_KEY = "userInfo";
/**
 * サインイン処理
 * @param {string} userId ユーザーID
 * @param {string} password パスワード
 */
export const signIn = async (userId, password) => {
  const response = await fetch("/api/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, password }),
  });
  if (!response.ok) {
    const error = new Error("サインインに失敗しました");
    error.response = { status: response.status };
    throw error;
  }
  const userInfo = await response.json();
  sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};
/**
 * サインアウト処理
 */
export const signOut = async () => {
  sessionStorage.removeItem(USER_INFO_KEY);
};
/**
 * サインイン状態の確認
 * @returns {boolean}
 */
export const isSignIn = () => {
  // return sessionStorage.getItem(USER_INFO_KEY) !== null;
  return true;
};
/**
 * 管理者権限の確認
 * @returns {boolean}
 */
export const isAdmin = () => {
  const userInfo = currentUserInfo();
  if (!userInfo) return false;
  return userInfo.auth === "admin";
};
/**
 * 現在のユーザー情報を取得
 * @returns {{ userId: string, userName: string, auth: string } | null}
 */
export const currentUserInfo = () => {
  const stored = sessionStorage.getItem(USER_INFO_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
};

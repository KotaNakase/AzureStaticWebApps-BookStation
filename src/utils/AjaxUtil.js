// Ajax通信ライブラリ
import axios from "axios";

export async function signIn(userId, password) {
  const url = "/api/sign-in";

  return await axios.post(url, {
    userId: userId,
    password: password,
  });
}

export async function getAllSapBooks() {
  const url = "/api/book";

  return await axios.get(url, {
    params: {},
  });
}

export async function getInformation() {
  const url = "/api/information";
  return await axios.get(url);
}

export async function postInformation(informationModel) {
  const url = "/api/information";
  return await axios.post(url, {
    title: informationModel.title,
    content: informationModel.content,
  });
}

export async function putInformation(informationModel) {
  const url = "/api/information";
  return await axios.put(url, {
    no: informationModel.no,
    title: informationModel.title,
    content: informationModel.content,
  });
}

export async function deleteInformation(no) {
  const url = `/api/information/${no}`;
  return await axios.delete(url);
}

export async function searchBooks(keyword) {
  // search url : google books api.
  const url = "https://www.googleapis.com/books/v1/volumes?q=" + keyword.replace(" ", "+");
  return await axios.get(url);
}

export async function addBook(addBookModel) {
  const url = "/api/book";

  return await axios.post(url, {
    isbn: addBookModel.isbn,
    book_id: addBookModel.book_id,
    title: addBookModel.title,
    description: addBookModel.description,
    img_url: addBookModel.img_url,
  });
}

export async function deleteBook(title) {
  const url = "/api/book/" + title;

  return await axios.delete(url);
}

export async function getUserById(userId) {
  const url = "/api/users/" + userId;

  return await axios.get(url);
}

export async function getUser(searchParams) {
  const url = "/api/users";
  const params = {
    userId: searchParams.userId,
    userName: searchParams.userName,
    address: searchParams.address,
  };
  return await axios.get(url, { params: params });
}

export async function getUserByAuth(auth) {
  const url = "/api/users";
  const params = {
    auth: auth,
  };
  return await axios.get(url, { params: params });
}

export async function postUser(userModel) {
  const url = "/api/users";

  return await axios.post(url, {
    userId: userModel.userId,
    userName: userModel.userName,
    password: userModel.password,
    gender: userModel.gender,
    auth: userModel.auth,
    address: userModel.address,
  });
}

export async function putUser(userModel) {
  const url = "/api/users";

  return await axios.put(url, {
    userId: userModel.userId,
    userName: userModel.userName,
    password: userModel.password,
    gender: userModel.gender,
    auth: userModel.auth,
    address: userModel.address,
  });
}

export async function deleteUser(userId) {
  const url = "/api/users/" + userId;

  return await axios.delete(url);
}

export async function postLending(lendModel) {
  const url = "/api/lending";

  return await axios.post(url, {
    isbn: lendModel.isbn,
    book_id: lendModel.book_id,
    lending_user_id: lendModel.lending_user_id,
    rental_date: lendModel.rental_date,
    return_plan_date: lendModel.return_plan_date,
    managed_user_id: lendModel.managed_user_id,
  });
}

export async function deleteLending(lendModel) {
  const url = "/api/lending";
  return await axios.request({
    method: "delete",
    url: url,
    data: {
      isbn: lendModel.isbn,
      book_id: lendModel.book_id,
      lending_user_id: lendModel.lending_user_id,
    },
  });
}

export async function searchLendingBooks(userId) {
  const url = "/api/lending/" + userId;

  return await axios.get(url);
}

export async function getAllSearchBooks(searchWord) {
  const url = "/api/book/search/" + searchWord;
  return await axios.get(url);
}

export async function alreadyLending(alreadyModel) {
  const url = "/api/lending/already";
  return await axios.post(url, {
    isbn: alreadyModel.isbn,
    lending_user_id: alreadyModel.lending_user_id,
  });
}

export async function getAllStudent() {
  const url = "/api/students";

  return await axios.get(url);
}

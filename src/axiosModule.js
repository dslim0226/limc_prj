import axios from "axios";
import store from "@/store";
import Swal from "sweetalert2";

const showAlert = (title, text, callback) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    allowOutsideClick: false
  }).then(callback);
};

export const axiosInstance = axios.create({
  baseURL: "http://kokimin7805.cafe24.com/",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    // "Access-Control-Allow-Methods": "*"
  }
});

axiosInstance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    const {
      response: { status }
    } = error;
    if (status === 401) {
      showAlert(
        "시간 만료",
        "로그인 유지 시간이 만료되었습니다. 다시 로그인하여 주세요.",
        () => {
          store.dispatch("login/initData");
        }
      );
    } else if (status === 500) {
      showAlert(
        "오류",
        "관리자에게 문의해주세요.",
        () => {}
      );
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  function(config) {
    const token = store.state.login.accessToken;
    if (config.url.includes("private") && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export function axiosConfig(token) {
  if (token === undefined) {
    store.dispatch("login/initData");
    return;
  }
  return {
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `JWT ${token}`
    }
  };
}

export function axiosGetConfig(token, data) {
  if (token === undefined || data === undefined) return;
  let header = axiosConfig(token);
  header["params"] = data;
  return header;
}

export function axiosConfigFileDownload(token) {
  return {
    responseType: "blob",
    headers: {
      "Content-Type": "application/json",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      Authorization: `JWT ${token}`
    }
  };
}

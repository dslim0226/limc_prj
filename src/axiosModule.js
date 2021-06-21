import axios from "axios";
import store from "@/store";
import Swal from "sweetalert2";

const showAlert = (title, text, callback) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    allowOutsideClick: false
  }).then(callback);
};

// accessToken 존재 하지 않으므로 user_id 나 user_level 이 존재할 경우 담아 보내기(없을 경우 로그인 해제?)
export const axiosInstance = axios.create({
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json"
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
      showAlert("오류", "관리자에게 문의해주세요.", () => {});
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  function(config) {
    const userInfo = {
      login_id: store.state.login.userId,
      login_level: store.state.login.userLevel
    };
    if (userInfo.login_id && userInfo.login_level && config.method === "get") {
      config.params = { ...config.params, ...userInfo };
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

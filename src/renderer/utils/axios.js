import axios from 'axios'
import store from '../store'
import { getToken} from './auth';

export const request = axios.create({
  baseURL: "https://cyber-tea-platform.anrunlu.net/", // 线上服务地址
  // baseURL: "http://anrunlu-test.com/",   // 后端测试地址
  // baseURL: "http://192.168.1.101:3002",
  // baseURL: "http://cyber.graph.net",
  timeout: 150000
});
export default ({
  app,
  router,
  store
}) => {
  // 每次后台响应都会先经过这个函数  响应拦截器
  request.interceptors.response.use(
    res => {
      return res;
    },
    err => {
      Loading.hide();
      if (err.response.status === 401) {
        Notify.create({
          message: err.response.data.error,
          type: "negative",
          position: "bottom"
        });
        removeToken();
        router.push("/login");
      } else if (err.response.status === 500) {
        Notify.create({
          message: "服务器异常，请稍后再试",
          color: "red",
          icon: "error",
          position: "bottom"
        });
      } else if (err.response.status === 404) {
        Notify.create({
          message: err.response.data.error,
          type: "negative",
          icon: "error",
          position: "bottom"
        });
      } else {
        Notify.create({
          message: err.response.data.error,
          type: "negative",
          icon: "error",
          position: "bottom",
          timeout: 300
        });
      }

      return Promise.reject(err);
    }
  );
  // 每次请求都会先经过这个函数 请求拦截器
  request.interceptors.request.use(
    config => {
      // do something before request is sent
      if (store.getters["user/token"]) {
        // let each request carry token
        config.headers.Authorization = "Bearer " + getToken() || "";
      }
      return config;
    },
    error => {
      // do something with request error
      console.log(error); // for debug
      return Promise.reject(error);
    }
  )
}

  

import axios from 'axios'
import { getToken} from './auth';
import store from '../store';
 const request = axios.create({
  baseURL: "https://cyber-tea-platform.anrunlu.net/", // 线上服务地址
  // baseURL: "https://cyber-test.anrunlu.net/",   // 后端测试地址
  // baseURL: "http://192.168.1.101:3002",
  // baseURL: "http://cyber.graph.net",
  timeout: 150000
});



request.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      config.headers.Authorization = "Bearer " + getToken() || "";
    }
    return config;
  },
  error => {
    // do something with request error
    return Promise.reject(error);
  }
)
export default request

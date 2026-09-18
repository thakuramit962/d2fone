import Axios from "axios";
import { API_URL } from "./appConstant";

const source = Axios.CancelToken.source();

const API = Axios.create({
  baseURL: API_URL,
  timeout: 30000,
  cancelToken: source.token,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default API;

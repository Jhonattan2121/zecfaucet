import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.42.25:2653",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  }
});
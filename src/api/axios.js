import axios from "axios";
let token = localStorage.getItem("token");

export default axios.create({
  baseURL: "http://192.168.178.58:3500",
  headers: { Authorization: "Bearer " + token },
});

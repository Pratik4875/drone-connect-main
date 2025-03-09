import axios from "axios";
// const API_BASE_URL = process.env.API_URL;
const url = "https://drone-connect.onrender.com";
const API_BASE_URL = `${url}/api/v1`;


export const api = axios.create({
  baseURL: API_BASE_URL,
});
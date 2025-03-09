import axios from "axios";
// const API_BASE_URL = process.env.API_URL;
const url = "http://localhost:4000";
const API_BASE_URL = `${url}/api/v1`;


export const api = axios.create({
  baseURL: API_BASE_URL,
});
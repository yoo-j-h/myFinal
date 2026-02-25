import axios from "axios";
import { API_CONFIG } from "./config";

const kioskApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: API_CONFIG.HEADERS,
});

export async function kioskLogin(empId, empPwd) {
  const res = await kioskApi.post("/api/auth/login", { empId, empPwd });

  // 백엔드 응답 구조 2가지 커버
  const token = (res.data && res.data.data && res.data.data.token) || res.data.token;
  if (!token) throw new Error("로그인 응답에 token이 없습니다.");
  return token;
}

export async function kioskGetToday(token) {
  const res = await kioskApi.get("/api/attendance/today", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function kioskCheckIn(token) {
  const res = await kioskApi.post("/api/attendance/check-in", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function kioskCheckOut(token) {
  const res = await kioskApi.post("/api/attendance/check-out", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
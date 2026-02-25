import api from "../axios";

/**
 * 백엔드: @RequestMapping("/api/auth/password")
 * - POST /api/auth/password/reset-link
 * - GET  /api/auth/password/validate?token=
 * - POST /api/auth/password/reset
 */
export const passwordResetService = {
  sendResetLink: ({ empId, email }) => {
    return api.post("/api/auth/password/reset-link", { empId, email });
  },

  validate: (token) => {
    // ✅ 컨트롤러와 동일: @GetMapping("/validate") + @RequestParam("token")
    return api.get("/api/auth/password/validate", { params: { token } });
  },

  reset: ({ token, newPassword }) => {
    // ✅ 컨트롤러와 동일: @PostMapping("/reset")
    return api.post("/api/auth/password/reset", { token, newPassword });
  },
};

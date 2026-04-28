import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  const user = JSON.parse(userStr);
  return { Authorization: `Bearer ${user.token}` };
};

export const adminService = {
  async getUsers() {
    const response = await axios.get(`${API_URL}/admin/users`, { headers: getHeaders() });
    return response.data;
  },

  async updateUserStatus(id: string, status: "active" | "deactivated") {
    const response = await axios.patch(
      `${API_URL}/admin/users/${id}/status`,
      { status },
      { headers: getHeaders() }
    );
    return response.data;
  },

  async getAuditLogs() {
    const response = await axios.get(`${API_URL}/admin/audit-logs`, { headers: getHeaders() });
    return response.data;
  }
};

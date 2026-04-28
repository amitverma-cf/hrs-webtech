import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  const user = JSON.parse(userStr);
  return { Authorization: `Bearer ${user.token}` };
};

export const prescriptionService = {
  async getPending() {
    const response = await axios.get(`${API_URL}/clinical/prescriptions/pending`, { 
      headers: getHeaders() 
    });
    return response.data;
  },

  async updateStatus(id: string, status: "dispensed" | "rejected") {
    const response = await axios.patch(
      `${API_URL}/clinical/prescriptions/${id}/status`, 
      { status },
      { headers: getHeaders() }
    );
    return response.data;
  }
};

import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getHeaders = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return {};
  const user = JSON.parse(userStr);
  return { Authorization: `Bearer ${user.token}` };
};

export const patientService = {
  async getPatients() {
    const response = await axios.get(`${API_URL}/patients`, { headers: getHeaders() });
    return response.data;
  },

  async getPatientById(id: string) {
    const response = await axios.get(`${API_URL}/patients/${id}`, { headers: getHeaders() });
    return response.data;
  },

  async createPatient(data: any) {
    const response = await axios.post(`${API_URL}/patients`, data, { headers: getHeaders() });
    return response.data;
  },

  async getVitals(patientId: string) {
    const response = await axios.get(`${API_URL}/clinical/vitals/${patientId}`, { headers: getHeaders() });
    return response.data;
  },

  async createVitalLog(data: any) {
    const response = await axios.post(`${API_URL}/clinical/vitals`, data, { headers: getHeaders() });
    return response.data;
  }
};

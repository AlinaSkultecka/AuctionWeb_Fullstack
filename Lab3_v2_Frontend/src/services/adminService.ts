import axios from "axios";

const API_URL = "http://localhost:5064/api/User"; 

export const getAllUsers = async (token: string) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deactivateUser = async (userId: number, token: string) => {
  const response = await axios.put(
    `${API_URL}/deactivate/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
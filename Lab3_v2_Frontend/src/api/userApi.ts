const API_URL = "http://localhost:5064/api/User";

export async function registerUser(userName: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userName, email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function loginUser(userName: string, password: string) {
  const response = await fetch("http://localhost:5064/api/User/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userName,
      password
    })
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
}

export async function updatePassword(token: string, currentPassword: string, newPassword: string) {
  const response = await fetch(`${API_URL}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  if (!response.ok) {
    throw new Error("Password update failed");
  }

  return response.text();
}
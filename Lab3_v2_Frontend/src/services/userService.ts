const BASE_URL = "http://localhost:5064/api/User";

// ================= REGISTER USER =================

export async function registerUser(
  userName: string,
  email: string,
  password: string
) {
  const response = await fetch(`${BASE_URL}/register`, {
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

// ================= LOGIN USER =================

export async function loginUser(userName: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userName,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid username or password");
  }

  return data;
}

// ================= UPDATE PASSWORD =================

export async function updatePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) {
  const response = await fetch(`${BASE_URL}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmNewPassword
    })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Failed to update password");
  }

  return text;
}

// ================= DELETE ACCOUNT =================

export async function deleteAccount(token: string) {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Failed to delete account");
  }

  return text;
}
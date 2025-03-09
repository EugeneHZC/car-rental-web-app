export async function login(name: string, email: string, password: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await response.json();

  return { response, json };
}

export async function register(name: string, email: string, password: string, role: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const json = await response.json();

  return { response, json };
}

export async function updateUserInfo(name: string, email: string, userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update/info/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  const json = await response.json();

  return { response, json };
}

export async function updateUserPassword(oldPassword: string, newPassword: string, userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update/password/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const json = await response.json();

  return { response, json };
}

export async function deleteUser(userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/delete/${userId}`, {
    method: "DELETE",
  });

  const json = await response.json();

  return { response, json };
}

export async function getUserByUserId(userId: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user/${userId}`);

  const json = await response.json();

  return { response, json };
}

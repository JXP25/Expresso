const API_BACKEND = process.env.NEXT_PUBLIC_API_URL;
export const NEXT_PUBLIC_FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
const BASE_URL = `${API_BACKEND}/api/v1`;

import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { apiCall } from "./api";

function getCSRFCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export interface LoginPostData {
  username: string;
  password: string;
}

export interface RegisterPostData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export async function login(data: LoginPostData) {
  const csrftoken = getCSRFCookie("csrftoken")!;
  const response = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (response.ok) {
    setCookie("accessToken", res.access, { maxAge: 30 * 24 * 60 * 60 });
  }
  return response.ok;
}

export const loginWithGoogle = async (code: string) => {
  const tokens = await apiCall(`/social/jwtsocial/jwt-pair-user`, {
    method: "POST",
    body: {
      provider: "google-oauth2",
      code,
      redirect_uri: `${NEXT_PUBLIC_FRONTEND_URL}/google`,
    },
    isAuth: false,
  });
  console.log(tokens);
  console.log({
    provider: "google-oauth2",
    code,
    redirect_uri: `${NEXT_PUBLIC_FRONTEND_URL}/google`,
  });
  setCookie("accessToken", tokens.token, { maxAge: 30 * 24 * 60 * 60 });
  return tokens;
};

export async function logOut() {
  const csrftoken = getCSRFCookie("csrftoken")!;
  const data = await fetch(`${BASE_URL}/auth/logout/`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: { "X-CSRFToken": csrftoken },
  });
  const logoutData = await data.json();
  if (data.ok) {
    deleteCookie("accessToken");
  }
  window.location.pathname = "/explore";
  return logoutData;
}

export async function register(data: RegisterPostData) {
  const response = await fetch(`${BASE_URL}/auth/registration/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (response.ok) {
    // After successful registration, automatically log in the user
    const loginResponse = await fetch(`${BASE_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password1,
      }),
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      setCookie("accessToken", loginData.access, { maxAge: 30 * 24 * 60 * 60 });
      return { success: true, autoLogin: true };
    }
  }
  
  return { success: response.ok, autoLogin: false };
}

export async function getChannelsUUID() {
  const csrftoken = getCSRFCookie("csrftoken")!;
  const accessToken = getCookie("accessToken");
  const response = await fetch(
    `${BASE_URL}/channels-auth/auth_for_ws_connection/
`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const uuid = await response.json();
  return uuid.uuid;
}
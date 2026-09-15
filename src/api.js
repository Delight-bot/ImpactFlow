const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const TOKEN_KEY = "ip_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (form) {
    payload = new URLSearchParams(form);
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  } else if (body !== undefined) {
    payload = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, { method, headers, body: payload });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      detail = (await res.json()).detail ?? detail;
    } catch {
      // non-JSON error body, fall back to statusText
    }
    throw new Error(typeof detail === "string" ? detail : "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", form: { username: email, password } }),
  me: () => request("/auth/me"),

  volunteers: () => request("/volunteers"),
  createVolunteer: (data) => request("/volunteers", { method: "POST", body: data }),
  updateVolunteer: (id, status) => request(`/volunteers/${id}`, { method: "PATCH", body: { status } }),
  updateBackgroundCheck: (id, status) => request(`/volunteers/${id}/background-check`, { method: "PATCH", body: { status } }),

  beneficiaries: () => request("/beneficiaries"),
  createBeneficiary: (data) => request("/beneficiaries", { method: "POST", body: data }),
  updateBeneficiary: (id, status) => request(`/beneficiaries/${id}`, { method: "PATCH", body: { status } }),

  matches: () => request("/matches"),
  generateMatches: () => request("/matches/generate", { method: "POST" }),
  updateMatch: (id, status) => request(`/matches/${id}`, { method: "PATCH", body: { status } }),
};

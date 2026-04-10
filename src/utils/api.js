const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";

export const getAuthToken = () => localStorage.getItem("trendcart_token") || "";

const parseErrorMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const firstError = payload.errors[0];
    return firstError.message || payload.message || fallback;
  }
  return payload.message || fallback;
};

const createApiError = (payload, fallback) => {
  const error = new Error(parseErrorMessage(payload, fallback));
  error.response = { data: payload || null };
  return error;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw createApiError(payload, "Request failed");
  }

  return payload;
};

export const api = {
  auth: {
    register: (data) =>
      apiRequest("/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data) =>
      apiRequest("/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    profile: () => apiRequest("/profile"),
    updateProfile: (data) =>
      apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getUsers: () => apiRequest("/users"),
  },
  products: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      const query = searchParams.toString();
      return apiRequest(`/products${query ? `?${query}` : ""}`);
    },
    getById: (id) => apiRequest(`/products/${id}`),
    create: (data) =>
      apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiRequest(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    remove: (id) =>
      apiRequest(`/products/${id}`, {
        method: "DELETE",
      }),
  },
  categories: {
    getAll: () => apiRequest("/categories"),
    create: (data) =>
      apiRequest("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      apiRequest(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    remove: (id) =>
      apiRequest(`/categories/${id}`, {
        method: "DELETE",
      }),
  },
  orders: {
    create: (data) =>
      apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMine: () => apiRequest("/orders/user/my-orders"),
    getAll: () => apiRequest("/orders"),
    update: (id, data) =>
      apiRequest(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    updateStatus: (id, status) =>
      apiRequest(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    cancel: (id) =>
      apiRequest(`/orders/${id}`, {
        method: "DELETE",
      }),
  },
};

export default api;

const rawBaseUrl =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "/api";

const apiBaseUrl = rawBaseUrl.endsWith("/")
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

const buildUrl = (path) => {
  if (path.startsWith("http")) {
    return path;
  }

  const normalisedPath = path.startsWith("/") ? path : `/${path}`;

  if (!apiBaseUrl) {
    return normalisedPath;
  }

  if (/^https?:\/\//i.test(apiBaseUrl)) {
    return `${apiBaseUrl}${normalisedPath}`;
  }

  return `${apiBaseUrl}${normalisedPath}`;
};

export const apiRequest = async (path, options = {}) => {
  const requestOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(buildUrl(path), requestOptions);
  const contentType = response.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");
  const body = hasJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = hasJson ? body?.message : body;
    const error = new Error(message || "Request failed");
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
};

export const getServices = () => apiRequest("/services");
export const getGuidelines = () => apiRequest("/guidelines");
export const getConsultations = () => apiRequest("/consultations");
export const submitConsultation = (data) =>
  apiRequest("/consultations", {
    method: "POST",
    body: JSON.stringify(data),
  });

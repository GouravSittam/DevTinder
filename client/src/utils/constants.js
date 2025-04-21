// For Development
// export const BASE_URL = "http://localhost:5000";

// For Production
// export const BASE_URL = "/api"

// Takes dynamic hostname
export const BASE_URL = location.hostname === "localhost" ? "http://localhost:5000": "/api";
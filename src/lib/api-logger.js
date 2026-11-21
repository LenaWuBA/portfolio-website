export function logApiRequest(feature, method, endpoint, status) {
  console.log(`[api:${feature}] ${method} ${endpoint} -> ${status}`);
}

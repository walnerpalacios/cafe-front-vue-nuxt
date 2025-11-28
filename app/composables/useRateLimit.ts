import type { count } from "console";

export function useRateLimit(
  key: "rate-limit",
  limitMs = 5000,
  maxAttempts = 5
) {
  const now = Date.now();

  const records = JSON.parse(localStorage.getItem(key) || "{}");

  if (!records.firstAttempt || now - records.firstAttempt > limitMs) {
    const newRecords = { firstAttempt: now, count: 0 };
    localStorage.setItem(key, JSON.stringify(newRecords));
    return () => true;
  }

  records.count = (records.count || 0) + 1;
  localStorage.setItem(key, JSON.stringify(records));

  if (records.count > maxAttempts) {
    console.log("Rate limit alcanzado");
    return () => false;
  }
    return () => true;

}

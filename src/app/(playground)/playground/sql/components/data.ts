import { T } from "./sql-constants";

// ─── DATA ─────────────────────────────────────────────────────────────────────

export const EMP = [
  { id: 1, name: "Amara Osei", dept: "Engineering", salary: 85000, hired: 2021, mgr_id: null, active: 1, city: "Accra" },
  { id: 2, name: "Bola Adeyemi", dept: "Analytics", salary: 72000, hired: 2020, mgr_id: 1, active: 1, city: "Lagos" },
  { id: 3, name: "Chidi Nwosu", dept: "Engineering", salary: 91000, hired: 2019, mgr_id: 1, active: 1, city: "Accra" },
  { id: 4, name: "Dami Afolabi", dept: "Product", salary: 68000, hired: 2022, mgr_id: null, active: 0, city: "Lagos" },
  { id: 5, name: "Efe Okonkwo", dept: "Analytics", salary: 75000, hired: 2021, mgr_id: 2, active: 1, city: "Abuja" },
  { id: 6, name: "Funke Balogun", dept: "Engineering", salary: 88000, hired: 2020, mgr_id: 1, active: 1, city: "Lagos" },
  { id: 7, name: "Grace Mensah", dept: "Product", salary: 71000, hired: 2022, mgr_id: null, active: 1, city: "Accra" },
  { id: 8, name: "Henry Eze", dept: "Analytics", salary: 69000, hired: 2023, mgr_id: 2, active: 1, city: "Abuja" },
  { id: 9, name: "Ifeoma Nwosu", dept: "Engineering", salary: 93000, hired: 2018, mgr_id: null, active: 1, city: "Lagos" },
  { id: 10, name: "Jide Okafor", dept: "Product", salary: 65000, hired: 2023, mgr_id: null, active: 1, city: "Lagos" },
];

export const ORDERS = [
  { order_id: 1, cust_id: 101, product: "Laptop", amount: 1200, status: "completed", order_date: "2024-01-15" },
  { order_id: 2, cust_id: 102, product: "Phone", amount: 450, status: "completed", order_date: "2024-01-22" },
  { order_id: 3, cust_id: 101, product: "Tablet", amount: 850, status: "pending", order_date: "2024-02-03" },
  { order_id: 4, cust_id: 103, product: "Monitor", amount: 320, status: "cancelled", order_date: "2024-02-10" },
  { order_id: 5, cust_id: 104, product: "Laptop", amount: 1200, status: "completed", order_date: "2024-02-18" },
  { order_id: 6, cust_id: null, product: "Phone", amount: 450, status: "completed", order_date: "2024-03-01" },
];

export const CUSTS = [
  { cust_id: 101, name: "Ifeoma N.", city: "Lagos", tier: "Gold" },
  { cust_id: 102, name: "James Obi", city: "Accra", tier: "Silver" },
  { cust_id: 103, name: "Kechi Onu", city: "Nairobi", tier: "Bronze" },
  { cust_id: 104, name: "Leke Fadipe", city: "Lagos", tier: "Gold" },
  { cust_id: 105, name: "Mimi Adaeze", city: "Accra", tier: "Silver" },
];

export const GC: Record<string, { bg: string; border: string; text: string }> = {
  Engineering: { bg: "rgba(96,165,250,.12)", border: "rgba(96,165,250,.4)", text: T.blue },
  Analytics: { bg: "rgba(74,222,128,.10)", border: "rgba(74,222,128,.4)", text: T.green },
  Product: { bg: "rgba(192,132,252,.10)", border: "rgba(192,132,252,.4)", text: T.purple },
  "2018": { bg: "rgba(251,146,60,.10)", border: "rgba(251,146,60,.4)", text: T.orange },
  "2019": { bg: "rgba(74,222,128,.10)", border: "rgba(74,222,128,.4)", text: T.green },
  "2020": { bg: "rgba(96,165,250,.12)", border: "rgba(96,165,250,.4)", text: T.blue },
  "2021": { bg: "rgba(192,132,252,.10)", border: "rgba(192,132,252,.4)", text: T.purple },
  "2022": { bg: "rgba(250,204,21,.10)", border: "rgba(250,204,21,.4)", text: T.yellow },
  "2023": { bg: "rgba(45,212,191,.10)", border: "rgba(45,212,191,.4)", text: T.teal },
  "0": { bg: "rgba(248,113,113,.08)", border: "rgba(248,113,113,.3)", text: T.red },
  "1": { bg: "rgba(74,222,128,.08)", border: "rgba(74,222,128,.3)", text: T.green },
  "101": { bg: "rgba(96,165,250,.12)", border: "rgba(96,165,250,.4)", text: T.blue },
  "102": { bg: "rgba(74,222,128,.10)", border: "rgba(74,222,128,.4)", text: T.green },
  "103": { bg: "rgba(251,146,60,.10)", border: "rgba(251,146,60,.4)", text: T.orange },
  "104": { bg: "rgba(192,132,252,.10)", border: "rgba(192,132,252,.4)", text: T.purple },
  "105": { bg: "rgba(45,212,191,.10)", border: "rgba(45,212,191,.4)", text: T.teal },
  "null": { bg: "rgba(248,113,113,.06)", border: "rgba(248,113,113,.2)", text: T.red },
};

export const gc = (k: any) =>
  GC[String(k)] || {
    bg: "rgba(255,255,255,.04)",
    border: "rgba(255,255,255,.15)",
    text: T.greyLight,
  };

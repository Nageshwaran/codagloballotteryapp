import { REFRESHCOUNT, TABLEDATA } from "./Constant";

export function refreshcount(payload) {
  return { type: REFRESHCOUNT, payload };
}

export function addtabledata(payload) {
  return { type: TABLEDATA, payload };
}

import { defineStore } from "pinia";

export default defineStore("config", () => {
  const minRequestTime = 500;
  return {
    minRequestTime,
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Указываем название репозитория с косыми чертами по краям
  base: "/portfolio-r3f-app/",
});

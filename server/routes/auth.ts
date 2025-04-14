import { Hono } from "hono";
import { urlCrypto } from "../utils/crypto";
import { env } from "@/config/env";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";
const authRoutes = new Hono();

// Create Asset - Changed endpoint to more appropriate route (optional)
authRoutes.get("/", async (c) => {
  const api_data_host = env.API_HOST;
  const endpoint = "api/azure/auth?redirect=";
  const redirect_url = `${env.VITE_URL}:${env.APP_PORT}`;
  try {
    // const url = urlCrypto.encrypt('https://api-data.hcml.co.id/api/azure/auth?redirect=https://dev.hcml.co.id:3000')
    const url = urlCrypto.encrypt(`${api_data_host}${endpoint}${redirect_url}`);
    deleteCookie(c, "hcmlSession", {
      path: "/",
      secure: true,
      domain: env.APP_DOMAIN,
    });

    console.log("url", `${api_data_host}${endpoint}${redirect_url}`, url);

    return c.redirect(url, 302);
  } catch (error) {
    return c.json(
      {
        error: "Error login",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export default authRoutes;

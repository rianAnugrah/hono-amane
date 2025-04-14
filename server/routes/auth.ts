import { Hono } from "hono";
import { crypto, urlCrypto } from "../utils/crypto";
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
authRoutes.get("/login", async (c) => {
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

authRoutes.post("/decrypt", async (c) => {
  try {
    const body = await c.req.json();

    const descrypted = crypto.decrypt(body.token);

    return c.json(JSON.parse(descrypted), 201);
  } catch (error) {
    console.error("Error creating asset:", error);
    return c.json({ error: "Failed to create asset" }, 500);
  }
});

export default authRoutes;

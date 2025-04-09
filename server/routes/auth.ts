import { Hono } from 'hono';
import { urlCrypto } from "../utils/crypto";

const authRoutes = new Hono();

// Create Asset - Changed endpoint to more appropriate route (optional)
authRoutes.get("/", async (c) => {
  try {
    const url = urlCrypto.encrypt('https://api-data.hcml.co.id/api/azure/auth?redirect=https://dev.hcml.co.id:3000')
    // Clear cookie
    // c.setCookie('hcmlSession', '', {
    //   path: '/',
    //   maxAge: 0
    // });

    // res.status(302).send(
    //   {
    //    // message : `${urlLogin}?unique=${random(5)}` , 
    //     test2: url,
    //     test : `https://api-data.hcml.co.id/api/azure/${urlCrypto.encrypt('https://api-data.hcml.co.id/api/azure/auth?redirect?https://dev.hcml.co.id:3000')}`,
    //     secret : `${env.APP_SECRET.slice(0, 16)}`
    //     }
    // );

    return c.redirect(url, 302);
  } catch (error) {
    return c.json({
      error: "Error login",
      details: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});

export default authRoutes;

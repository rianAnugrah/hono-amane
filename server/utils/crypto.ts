// crypto.ts
import { env } from "../../config/env"
import { crypt } from "@tawasukha/crypt"
import { urlcrypt } from "@tawasukha/urlcrypt"
import bcrypt from "bcryptjs"

export function hashPassword(password: string) {
  return password.includes("$2a$10$") ? password : bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash)
}

//export * from "../shared/utils"

export const crypto = crypt({
  output: "base64url",
  secret: env.APP_SECRET.slice(0, 16),
})


export const urlCrypto = urlcrypt({
  pattern: `${env.API_HOST}api/azure/:action`,
  secret: env.APP_SECRET.slice(0, 16),
})

export async function generateCookie(name: string) {
  const account = {
    name,
  }
  if (env.NODE_ENV === "development") {
    return crypto.encrypt(JSON.stringify(account))
  }
  return "Not for production"
}

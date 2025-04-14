import { render } from "vike/abort";

// This guard() hook protects all pages /pages/admin/**/+Page.js

export async function guard(pageContext: any) {
  console.log("CONTEXT", pageContext?.someGlobalValue);
}

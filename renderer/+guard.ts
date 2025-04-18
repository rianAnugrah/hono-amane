

import { navigate } from "vike/client/router";
import { useUserStore } from "@/stores/store-user-login";
import type { PageContext } from "vike/types";

export async function guard(pageContext: PageContext) {
  const state = useUserStore.getState();

  if (!state.isAuth && typeof window !== "undefined") {
    await navigate("/login");
  }
}

import { navigate } from "vike/client/router";
import { useUserStore } from "@/stores/store-user-login";

export async function guard(pageContext) {
  const state = useUserStore.getState();

  if (!state.isAuth && typeof window !== "undefined") {
    await navigate("/login");
  }
}

import { useEffect } from "react";
import { navigate } from "vike/client/router";

export function Page() {
  useEffect(() => {
    navigate("/dashboard");
  }, []);

  return null;
}

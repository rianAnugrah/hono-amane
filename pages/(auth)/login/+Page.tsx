import { useEffect, useState } from "react";
import Logo from "@/components/svg/logo";
import "@/renderer/PageShell.css";

export { Page };

function Page() {
  const [loginUrl, setLoginUrl] = useState("");
  const url_login = `/api/auth/login`;

  useEffect(() => {
    async function fetchLoginUrl() {
      try {
        const response = await fetch(url_login);
        const data = await response.text(); // or response.json() if it returns JSON
        setLoginUrl(data);
      } catch (error) {
        console.error("Error fetching login URL:", error);
        setLoginUrl(url_login); // fallback to original URL if fetch fails
      }
    }

    fetchLoginUrl();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Layout>
      <div className="flex flex-col items-center w-full gap-4 text-white">
        <Logo />
        <h1 className="text-2xl font-bold">Asset Management</h1>

        <a
          href={loginUrl}
          className="btn bg-[#2F2F2F] text-white border-black shadow-none"
        >
          <svg
            aria-label="Microsoft logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M96 96H247V247H96" fill="#f24f23"></path>
            <path d="M265 96V247H416V96" fill="#7eba03"></path>
            <path d="M96 265H247V416H96" fill="#3ca4ef"></path>
            <path d="M265 265H416V416H265" fill="#f9ba00"></path>
          </svg>
          Login with HCML
        </a>
      </div>
    </Layout>
  );
}

// children includes <Page/>
function Layout({ children } :{children :React.ReactNode}) {
  return (
    <div className="h-screen w-full bg-gradient-to-b  from-[#476f80] to-[#647c89] flex items-center justify-center">
      <div>{children}</div>
    </div>
  );
}

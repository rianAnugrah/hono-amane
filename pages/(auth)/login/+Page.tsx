import React, { useEffect, useState } from "react";
import Logo from "@/components/svg/logo";
import "@/renderer/PageShell.css";

export { Page };

function Page() {
  const [loginUrl, setLoginUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const defaultLoginUrl = `/api/auth/login`;

  useEffect(() => {
    async function fetchLoginUrl() {
      setLoading(true);
      setError("");
      
      try {
        const response = await fetch(defaultLoginUrl);
        
        if (response.ok) {
          // Check if the response is a redirect URL
          if (response.redirected) {
            setLoginUrl(response.url);
          } else {
            // Try to get the login URL from the response
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              setLoginUrl(data.url || defaultLoginUrl);
            } else {
              const text = await response.text();
              // If the response is a URL, use it
              if (text.startsWith("http")) {
                setLoginUrl(text.trim());
              } else {
                setLoginUrl(defaultLoginUrl);
              }
            }
          }
        } else {
          throw new Error(`Server returned ${response.status} ${error}`);
        }
      } catch (error) {
        console.error("Error fetching login URL:", error);
        setError("Failed to connect to authentication service. Please try again later.");
        setLoginUrl(defaultLoginUrl);
      } finally {
        setLoading(false);
      }
    }

    fetchLoginUrl();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Layout>
      <div className="flex flex-col items-center w-full gap-4 text-white">
        <Logo />
        <h1 className="text-2xl font-bold">Asset Management</h1>

        {/* {error && (
          <div className="bg-red-800 text-white px-4 py-2 rounded text-center max-w-xs mb-2">
            {error}
          </div>
        )} */}

        <a
          href={loading ? '#' : loginUrl}
          className={`btn bg-[#2F2F2F] text-white border-black shadow-none ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={(e) => loading && e.preventDefault()}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm mr-2"></span>
          ) : (
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
          )}
          {loading ? 'Connecting...' : 'Login with HCML'}
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

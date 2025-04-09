import { useEffect, useState } from "react";

export { Page }

function Page() {

  const [loginUrl, setLoginUrl] = useState('');
  const url_login = `/api/login`;

  useEffect(() => {
    async function fetchLoginUrl() {
      try {
        const response = await fetch(url_login);
        const data = await response.text(); // or response.json() if it returns JSON
        setLoginUrl(data);
      } catch (error) {
        console.error('Error fetching login URL:', error);
        setLoginUrl(url_login); // fallback to original URL if fetch fails
      }
    }
    
    fetchLoginUrl();
  }, []); // Empty dependency array means this runs once on mount


  return (
    <>
      <h1>Login</h1>
      <p>Example of using Vike.</p>
      <a href={loginUrl} className="btn btn-neutral">Login</a>
    </>
  )
}

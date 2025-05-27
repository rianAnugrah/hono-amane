import React, { useState, useEffect } from 'react';

function Logo() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder div with the same dimensions during SSR
    return <div className="w-full h-full" style={{ width: '130px', height: '130px' }} />;
  }

  return (
    <svg
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M62 1.73205C63.8564 0.660253 66.1436 0.660254 68 1.73205L118.292 30.768C120.148 31.8397 121.292 33.8205 121.292 35.9641V94.0359C121.292 96.1795 120.148 98.1603 118.292 99.232L68 128.268C66.1436 129.34 63.8564 129.34 62 128.268L11.7083 99.232C9.85194 98.1603 8.70835 96.1795 8.70835 94.0359V35.9641C8.70835 33.8205 9.85194 31.8397 11.7083 30.768L62 1.73205Z"
        fill="white"
      />
      <path
        d="M63 8.54105C64.2376 7.82652 65.7624 7.82652 67 8.54105L112.895 35.0385C114.132 35.753 114.895 37.0735 114.895 38.5026V91.4974C114.895 92.9265 114.132 94.247 112.895 94.9615L67 121.459C65.7624 122.173 64.2376 122.173 63 121.459L17.1051 94.9615C15.8675 94.247 15.1051 92.9265 15.1051 91.4974V38.5026C15.1051 37.0735 15.8675 35.753 17.1051 35.0385L63 8.54105Z"
        fill="url(#logo_gradient)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M104.219 38.8929C105.552 39.6627 105.552 41.5872 104.219 42.357L66 64.4226C65.3812 64.7799 64.6188 64.7799 64 64.4226L25.7812 42.357C24.4479 41.5872 24.4479 39.6627 25.7813 38.8929L64 16.8274C64.6188 16.4701 65.3812 16.4701 66 16.8274L104.219 38.8929Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.7812 49.7434C24.4479 48.9736 22.7812 49.9359 22.7812 51.4755V88.2203C22.7812 88.9348 23.1624 89.5951 23.7813 89.9524L64 113.173C64.6188 113.53 65.3812 113.53 66 113.173L106.219 89.9524C106.838 89.5951 107.219 88.9348 107.219 88.2203V40.625L107.219 46.8567C107.219 47.5712 106.838 48.2315 106.219 48.5887L66 71.809C65.3812 72.1663 64.6188 72.1663 64 71.809L25.7812 49.7434Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="logo_gradient"
          x1="65"
          y1="7.38635"
          x2="65"
          y2="122.614"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F30000" />
          <stop offset="1" stopColor="#54A9D7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Logo;

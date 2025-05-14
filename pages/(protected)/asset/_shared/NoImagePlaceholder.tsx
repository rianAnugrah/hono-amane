import React from 'react';

interface NoImagePlaceholderProps {
  assetName?: string;
  className?: string;
}

const NoImagePlaceholder: React.FC<NoImagePlaceholderProps> = ({ 
  assetName = "No Image", 
  className = "w-full h-full" 
}) => {
  // Generate a pastel color based on the asset name for some visual diversity
  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate pastel colors (lighter, soft colors)
    const h = hash % 360;
    return `hsl(${h}, 70%, 85%)`;
  };

  const bgColor = getColorFromString(assetName);
  const textColor = '#4b5563'; // Gray-600
  
  // Get the initials from the asset name (up to 2 characters)
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(assetName);

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <rect width="200" height="200" fill={bgColor} />
      
      {/* Icon */}
      <g transform="translate(55, 55)">
        <path
          d="M75 70v10c0 8.3-6.7 15-15 15H15c-8.3 0-15-6.7-15-15V70H75zM15 10h45c8.3 0 15 6.7 15 15v35H0V25c0-8.3 6.7-15 15-15zm50 25c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"
          fill="#ffffff"
          fillOpacity="0.3"
        />
      </g>
      
      {/* Asset initials */}
      <text
        x="100"
        y="115"
        fontFamily="sans-serif"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        fill={textColor}
      >
        {initials}
      </text>
      
      {/* "No Image" label */}
      <text
        x="100"
        y="145"
        fontFamily="sans-serif"
        fontSize="12"
        textAnchor="middle"
        fill={textColor}
      >
        No Image Available
      </text>
    </svg>
  );
};

export default NoImagePlaceholder; 
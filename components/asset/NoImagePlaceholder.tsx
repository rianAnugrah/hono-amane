import { ImageIcon } from 'lucide-react';
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
    <div
      className={`${className} flex items-center flex-col justify-center relative`}
      style={{backgroundColor: bgColor}}
    >
      <ImageIcon size={120} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10'  />
      
      {/* Asset initials */}
      <div className='text-5xl font-extrabold text-gray-400'>
        {initials}
      </div>
      
      {/* "No Image" label */}
      <div className={`text-xl text-gray-400 leading-10`}>
        No Image Available
      </div> 
    </div>
  );
};

export default NoImagePlaceholder; 
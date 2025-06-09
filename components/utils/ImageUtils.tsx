import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

// Function to determine if an image array has valid images
export const hasValidImages = (images?: string[] | null): boolean => {
  return Array.isArray(images) && images.length > 0 && images.some(img => !!img);
};

// Function to generate color based on string
export const getColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate pastel colors (lighter, soft colors)
  const h = hash % 360;
  return `hsl(${h}, 70%, 85%)`;
};

// Function to get initials from name
export const getInitials = (name: string) => {
  if (!name) return 'NA';
  
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Verify if an image URL is valid/loadable
export const isImageUrlValid = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image URL:', error);
    return false;
  }
};

// Component to render either an image or placeholder
interface ImageWithFallbackProps {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  assetName?: string;
  onError?: () => void;
  loadingPlaceholder?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  assetName = "No Image",
  onError,
  loadingPlaceholder = true
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setHasError(false);
      
      // Preload the image
      const img = new window.Image();
      img.src = src;
      
      img.onload = () => {
        setIsLoading(false);
      };
      
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
        if (onError) {
          onError();
        }
      };
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [src, onError]);
  
  // If no valid source or error occurred, use placeholder
  if (!src || hasError) {
    return <RenderPlaceholder assetName={assetName} className={className} />;
  }

  // Show loading state
  if (isLoading && loadingPlaceholder) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 animate-pulse`}>
        <Image size={36} className="text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        setHasError(true);
        if (onError) {
          onError();
        }
      }}
      loading="lazy"
    />
  );
};

// Placeholder component with colored background and initials
interface RenderPlaceholderProps {
  assetName: string;
  className?: string;
}

const RenderPlaceholder: React.FC<RenderPlaceholderProps> = ({ assetName, className }) => {
  // Generate a predictable background color based on the assetName
  const bgColor = getColorFromString(assetName);
  const initials = getInitials(assetName);

  return (
    <div 
      className={`${className} flex flex-col items-center justify-center bg-opacity-80 relative overflow-hidden`} 
      style={{ backgroundColor: bgColor }}
    >
      <Image 
        size={40} 
        className="absolute inset-0 m-auto text-white opacity-10 transform scale-150" 
      />
      <span className="text-2xl font-bold text-gray-700 z-10">{initials}</span>
      <span className="text-xs mt-1 text-gray-600 z-10">No Image</span>
    </div>
  );
}; 
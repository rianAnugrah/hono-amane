import React from 'react';
import NoImagePlaceholder from '../../pages/(protected)/asset/_shared/NoImagePlaceholder';

// Function to determine if an image array has valid images
export const hasValidImages = (images?: string[] | null): boolean => {
  return Array.isArray(images) && images.length > 0;
};

// Component to render either an image or placeholder
interface ImageWithFallbackProps {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  assetName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  className = "w-full h-full object-cover",
  assetName = "No Image"
}) => {
  // If no valid source, use placeholder
  if (!src) {
    return <NoImagePlaceholder assetName={assetName} className={className} />;
  }

  // Handle image load error by showing placeholder
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc) {
      e.currentTarget.src = fallbackSrc;
    } else {
      // Replace with placeholder (we can't directly render SVG here, so we hide the broken image)
      e.currentTarget.style.display = 'none';
      e.currentTarget.parentElement?.classList.add('show-placeholder');
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
      />
      {/* Hidden placeholder that will be shown if image errors and no fallback */}
      <div className="hidden placeholder-container">
        <NoImagePlaceholder assetName={assetName} className={className} />
      </div>
      <style>{`
        .show-placeholder .placeholder-container {
          display: block;
        }
      `}</style>
    </>
  );
}; 
import { useState, useEffect } from 'react';

interface SmoothImageLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
}

const SmoothImageLoader: React.FC<SmoothImageLoaderProps> = ({ 
  src, 
  alt, 
  className = "", 
  onError,
  loading = "lazy",
  ...props 
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setImageState('loaded');
    };
    
    img.onerror = () => {
      setImageState('error');
      if (onError) onError();
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onError]);

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* Skeleton Loading State */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 2s infinite linear',
            }}
          />
        </div>
      )}
      
      {/* Error State */}
      {imageState === 'error' && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
      
      {/* Actual Image */}
      {imageState === 'loaded' && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 ease-out transform
                     ${imageState === 'loaded' 
                       ? 'opacity-100 scale-100 blur-0' 
                       : 'opacity-0 scale-105 blur-sm'
                     } group-hover:scale-105`}
          loading={loading}
        />
      )}
      
      {/* Global CSS for shimmer animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `
      }} />
    </div>
  );
};

export default SmoothImageLoader;
import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className = '', width, height, aspectRatio, objectFit = 'cover', placeholderColor = '#e5e7eb', priority = false, onLoad, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const style = {
    ...props.style,
    aspectRatio: aspectRatio,
    objectFit,
  };

  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={{ aspectRatio, backgroundColor: placeholderColor }}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: placeholderColor }} />
      )}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : isInView && src ? (
        <img
          src={src}
          alt={alt || ''}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={style}
          {...props}
        />
      ) : null}
    </div>
  );
};

export default LazyImage;

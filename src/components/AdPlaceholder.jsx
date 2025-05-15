
import React from 'react';

const AdPlaceholder = ({ width, height, text }) => {
  return (
    <div className="flex justify-center w-full">
      <div
        className="ad-placeholder"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          maxWidth: '100%' 
        }}
        aria-label={`Espaço para anúncio ${width}x${height}`}
      >
        <span className="text-xs text-muted-foreground/70">{text || `Espaço para anúncio ${width}x${height}`}</span>
      </div>
    </div>
  );
};

export default AdPlaceholder;

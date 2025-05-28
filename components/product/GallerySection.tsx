'use client'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Snapshots {
  images?: string[];
  video?: string | null;
}

export const GallerySection = ({ snapshots }: { snapshots: Snapshots }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!snapshots || (!snapshots.images?.length && !snapshots.video)) {
    return null;
  }

  // Combine video and images into a single media array
  const mediaItems = [];
  
  if (snapshots.video) {
    mediaItems.push({ type: 'video', src: snapshots.video });
  }
  
  if (snapshots.images?.length) {
    snapshots.images.forEach(image => {
      mediaItems.push({ type: 'image', src: image });
    });
  }

  const currentMedia = mediaItems[activeIndex];

  const handlePrevious = () => {
    setActiveIndex(prev => prev === 0 ? mediaItems.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setActiveIndex(prev => prev === mediaItems.length - 1 ? 0 : prev + 1);
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div id='gallery' className="w-full max-w-6xl mx-auto mb-12 rounded-2xl border border-[#d4d4d482] py-4 px-8">
      <h3 className="text-[28px] font-semibold text-[#000000] mb-6">Gallery</h3>
      
      {/* Main Preview Area */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
        {currentMedia?.type === 'video' ? (
          <video
            key={currentMedia.src}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
          >
            <source src={currentMedia.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={currentMedia?.src}
            alt={`Preview ${activeIndex + 1}`}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-indigo cursor-pointer shadow text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-indigo cursor-pointer shadow text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {/* Media Counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {activeIndex + 1} / {mediaItems.length}
        </div>
      </div>
      
      {/* Thumbnail Navigation */}
      {mediaItems.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {mediaItems.map((media, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {media.type === 'video' ? (
                <div className="relative w-full h-full bg-gray-200">
                  <video className="w-full h-full object-cover" muted>
                    <source src={media.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play size={16} className="text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={media.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
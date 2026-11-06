import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CaseLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export default function CaseLightboxModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0
}: CaseLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Sync initialIndex when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
    }
  }, [isOpen, initialIndex, images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none"
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="relative max-w-5xl w-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Control Bar */}
          <div className="w-full flex items-center justify-between pb-3 text-white">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90">
              案例预览 {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="关闭 (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Enlarged Image Stage with Slide Animation */}
          <div className="relative w-full flex items-center justify-center min-h-[50vh] max-h-[76vh]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`案例图 ${currentIndex + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="max-h-[76vh] max-w-full w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </AnimatePresence>

            {/* Left Prev Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                title="上一张 (←)"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            {/* Right Next Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105"
                title="下一张 (→)"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Navigation Strip */}
          {images.length > 1 && (
            <div className="flex items-center space-x-2.5 mt-4 overflow-x-auto py-1 px-2 max-w-full">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                    idx === currentIndex
                      ? 'border-blue-500 scale-105 shadow-md'
                      : 'border-white/20 opacity-55 hover:opacity-100 hover:border-white/60'
                  }`}
                >
                  <img
                    src={img}
                    alt={`缩略图 ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}

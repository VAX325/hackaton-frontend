import React, { useEffect, useState } from 'react';

interface LoaderProps {
  visible: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ visible }) => {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    } else {
      // Wait for the fade-out transition to finish before unmounting
      const timer = setTimeout(() => setShouldRender(false), 700);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-radiy-bg flex flex-col items-center justify-center z-[100] transition-opacity ${visible ? 'opacity-100 duration-0' : 'opacity-0 duration-700 pointer-events-none'}`}
    >
      {/* Atom Container */}
      <div className="relative w-32 h-32 animate-pulse">
        {/* Nucleus */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-radiy-mint rounded-full shadow-glow-strong z-10"></div>

        {/* Orbit 1 */}
        <div className="atom-orbit orbit-1">
          <div className="electron"></div>
        </div>

        {/* Orbit 2 */}
        <div className="atom-orbit orbit-2">
          <div className="electron"></div>
        </div>

        {/* Orbit 3 */}
        <div className="atom-orbit orbit-3">
          <div className="electron"></div>
        </div>
      </div>

      {/* Static Logo Text */}
      <div className="mt-8 text-radiy-mint font-bold text-xl tracking-widest text-glow">
        RADIY
      </div>
    </div>
  );
};
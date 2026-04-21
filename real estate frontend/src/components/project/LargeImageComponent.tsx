import * as React from 'react';
import { motion } from 'framer-motion';

interface LargeImageComponentProps {
  image: string;
  alt: string;
}

export const LargeImageComponent = ({
  image,
  alt,
}: LargeImageComponentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="lg:col-span-8 relative w-full h-[300px] sm:h-[360px] md:h-[420px] lg:h-[500px] rounded-[32px] overflow-hidden group"
    >
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      
      {/* Glass Edge Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[rgba(255,255,255,0.25)] border-[1.5px] rounded-[32px] z-20 shadow-[inset_0_0_30px_rgba(255,255,255,0.08)]" />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
};

export default LargeImageComponent;

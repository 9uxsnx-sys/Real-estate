import * as React from 'react';
import { Bed, Bath, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  imageUrl?: string;
  price: string;
  title?: string;
  location: string;
  beds: number;
  baths: number;
  space: number;
  propertyType?: string;
  isNew?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export const PropertyCard = ({
  imageUrl = "https://proxy.extractcss.dev/https://framerusercontent.com/images/rfYNgbnQgBOihPRT6UaLPi82u0.jpg?scale-down-to=1024",
  price,
  title,
  location,
  beds,
  baths,
  space,
  propertyType,
  isNew = false,
  className,
  onClick,
  href = "#",
}: PropertyCardProps) => {
  return (
    <a 
      href={href} 
      className={cn(
        "flex flex-col w-full relative cursor-pointer no-underline group",
        className
      )}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="w-full aspect-[4/3] bg-zinc-100 rounded-3xl overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title || location} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="pt-3 flex flex-col gap-1 px-1">
        {/* Price */}
        <p className="text-zinc-900 text-[20px] font-semibold tracking-[-0.01em] leading-[1.4]">
          $ {Number(price.replace(/[^0-9]/g, '')).toLocaleString()}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-zinc-500 text-[14px] font-light">
          <span>{location}</span>
        </div>

        {/* Specs - Beds, Baths, Space */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-zinc-400 stroke-[2]" />
            <span className="text-zinc-600 text-[14px] font-medium">{beds}</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-zinc-400 stroke-[2]" />
            <span className="text-zinc-600 text-[14px] font-medium">{baths}</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-zinc-400 stroke-[2]" />
            <span className="text-zinc-600 text-[14px] font-medium">{space} m²</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default PropertyCard;

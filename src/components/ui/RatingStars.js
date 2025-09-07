import React from 'react';
import { Star } from 'lucide-react';
import { useLocalization } from '../../contexts/LocalizationContext';

const RatingStars = ({ rating, size = 'sm' }) => {
  const { isRTL } = useLocalization();
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
      <span className={`text-sm text-gray-600 ${isRTL ? 'mr-1' : 'ml-1'}`}>{rating}</span>
    </div>
  );
};

export default RatingStars;

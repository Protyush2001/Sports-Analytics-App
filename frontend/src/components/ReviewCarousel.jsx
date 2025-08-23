import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ReviewCard from './ReviewCard';

const reviews = [
  { name: 'Alice', rating: 5, text: 'Amazing experience!' },
  { name: 'Bob', rating: 4, text: 'Very good, will recommend.' },
  { name: 'Charlie', rating: 3, text: 'It was okay.' },
  { name: 'Diana', rating: 5, text: 'Loved it!' },
  { name: 'Ethan', rating: 2, text: 'Not great.' },
  { name: 'Fiona', rating: 4, text: 'Pretty solid overall.' },
  { name: 'George', rating: 1, text: 'Would not recommend.' },
  { name: 'Hannah', rating: 5, text: 'Perfect in every way!' },
];

const AUTO_SCROLL_INTERVAL = 4000;
const ReviewCarousel = () => {
  const [index, setIndex] = useState(0);
  const cardsPerPage = 4;

  const handlePrev = () => {
    setIndex((prev) =>
      prev - cardsPerPage < 0 ? reviews.length - cardsPerPage : prev - cardsPerPage
    );
  };



  const handleNext = () => {
    setIndex((prev) =>
      prev + cardsPerPage >= reviews.length ? 0 : prev + cardsPerPage
    );
  };
    useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);



  const visibleReviews = reviews.slice(index, index + cardsPerPage);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-6xl mb-4 px-4">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>

        <div className="overflow-hidden w-full flex justify-center">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={index}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex"
            >
              {visibleReviews.map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          disabled={index + cardsPerPage >= reviews.length}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ReviewCarousel;
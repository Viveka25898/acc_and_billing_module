import React from 'react';

const InfoCards = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 bg-gray-50">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
        >
          <h3 className="text-xs md:text-sm text-gray-600 mb-2 uppercase tracking-wide font-medium">
            {card.title}
          </h3>
          <p className="text-xl md:text-2xl font-bold text-pink-500">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
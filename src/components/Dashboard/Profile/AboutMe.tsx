import React from 'react';

const AboutMe: React.FC = () => {
  return (
    <div className="w-full h-5/10 md:p-6">
      <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
        <div className="flex justify-between border-b-0 border-lightest sm:px-6">
          <h3 className="px-4 py-5 text-lg leading-6 font-medium text-darkest">
            About Me coming soon...
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;

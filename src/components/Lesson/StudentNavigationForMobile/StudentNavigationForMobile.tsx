import React, {useState} from 'react';

const StudentNavigationForMobile = () => {
  const samplePages = [
    {
      id: 1,
      name: 'Intro'
    },
    {
      id: 2,
      name: 'Survey'
    },
    {
      id: 3,
      name: 'End'
    }
  ];

  const [currentPage, setCurrentPage] = useState('Intro');
  const [showPages, setShowPages] = useState(false);

  return (
    <div className="p-4  sm:hidden fixed bottom-2 flex items-center justify-center">
      <button
        onClick={() => setShowPages(true)}
        className=" w-auto iconoclast:bg-main curate:bg-main p-2 text-white rounded-lg">
        {currentPage}
      </button>
      {showPages && (
        <select>
          {samplePages.map((page) => (
            <option key={page.id}>{page.name}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default StudentNavigationForMobile;

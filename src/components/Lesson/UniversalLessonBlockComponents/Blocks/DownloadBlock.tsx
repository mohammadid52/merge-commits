import React from 'react';

const DownloadBlock = ({value}: {value: {id: string; label: string}[]}) => {
  return (
    <div className="p-4">
      {value && value.length > 0 && (
        <h3 className="dark:bg-gray-700 bg-gray-200 p-4 rounded-lg dark:text-white text-gray-900">
          Edit downloadable files
        </h3>
      )}
    </div>
  );
};

export default DownloadBlock;

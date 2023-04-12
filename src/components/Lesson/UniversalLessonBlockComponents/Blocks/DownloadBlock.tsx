import React from 'react';

const DownloadBlock = ({value}: {value: {id: string; label: string}[]}) => {
  return (
    <div className="p-4">
      {value && value.length > 0 && (
        <h3 className="dark:bg-dark   bg-lightest p-4 rounded-lg dark:text-white text-darkest">
          Edit downloadable files
        </h3>
      )}
    </div>
  );
};

export default DownloadBlock;

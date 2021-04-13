import React, { useContext } from 'react';
import { PagePart, UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';

const DummyBlock = (props: { selectedPageDetails: UniversalLessonPage }) => {
  const { selectedPageDetails } = props;
  return (
    <div className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50`}>
      {selectedPageDetails && selectedPageDetails?.pageContent.length > 0 ? (
        <>
          <p className={`text-white`}>ID: {selectedPageDetails?.id}</p>
          <p className={`text-white`}>TITLE: {selectedPageDetails?.title}</p>
          <p className={`text-white`}>DESC: {selectedPageDetails?.description}</p>
          <p className={`text-white`}>CLASS: {selectedPageDetails?.class}</p>
          {selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number) => (
            <>
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <p className={`text-white`}>ID: {pagePart.id}</p>
                  <p className={`text-white`}>PARTTYPE: {pagePart.partType}</p>
                  <p className={`text-white`}>CLASS: {pagePart.class}</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <p className={`text-white`}>PARTCONTENT:</p>
                  <p>{JSON.stringify(pagePart.partContent)}</p>
                </div>
              </div>
            </>
          ))}
        </>
      ) : (
        <h1>This page has no layout information.</h1>
      )}
    </div>
  );
};

export default DummyBlock;

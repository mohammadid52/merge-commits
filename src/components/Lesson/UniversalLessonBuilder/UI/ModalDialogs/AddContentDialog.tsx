import React from 'react';

const AddContentDialog = () => {
  return (
    <div className={`grid grid-cols-3 gap-2`}>
      {/* LEFT */}
      <div>
        <h2>Text-Content</h2>
        <div className={`h-full w-full`}>
          <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
            <div className={`w-full h-24 bg-gray-200 rounded`}>
              <p className={`text-left block text-xs font-medium text-gray-700`}>
                Section Title
              </p>
            </div>

            <div className={`w-full h-24 bg-gray-200 rounded`}>
              <p className={`text-left block text-xs font-medium text-gray-700`}>
                Paragraph
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE */}
      <div>
        <h2>Media</h2>
        <div className={`h-full w-full`}>
          <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
            <div className={`w-full h-24 bg-gray-200 rounded`}>
              <p className={`text-left block text-xs font-medium text-gray-700`}>Image</p>
            </div>

            <div className={`w-full h-24 bg-gray-200 rounded`}>
              <p className={`text-left block text-xs font-medium text-gray-700`}>
                Youtube Video
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <h2>User Interaction</h2>
        <div className={`h-full w-full`}>
          <div className={`grid grid-cols-1 gap-2 h-auto w-full`}>
            <div className={`w-full h-24 bg-gray-200 rounded`}>
              <p className={`text-left block text-xs font-medium text-gray-700`}>
                Question & Text Input
              </p>
            </div>

            <div className={`w-full h-24 bg-gray-200 rounded`}>
              <p className={`text-left block text-xs font-medium text-gray-700`}>
                Other Activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContentDialog;

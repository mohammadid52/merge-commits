import {communityTypes} from '@components/Community/constants.community';
import {getImageFromS3Static} from '@utilities/services';
import React from 'react';

const Card = ({cardDetails}: any): JSX.Element => {
  if (cardDetails.type === communityTypes.SPOTLIGHT) {
    const media = getImageFromS3Static(cardDetails.media);

    return (
      <div className="">
        <div className="flex max-w-xl bg-white shadow-md rounded-lg overflow-hidden mx-auto">
          <div className="flex items-center w-full">
            <div className="w-full">
              {cardDetails.type === communityTypes.CHECK_IT_OUT && (
                <div className="flex flex-row mt-2 px-2 py-3 mx-3">
                  <div className="w-auto h-auto rounded-full">
                    <img
                      className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
                      alt="User avatar"
                      src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200"
                    />
                  </div>
                  <div className="flex flex-col mb-2 ml-4 mt-1">
                    <div className="text-gray-600 text-sm font-semibold">Sara Lauren</div>
                    <div className="flex  mt-1">
                      <div className="text-blue-700 w-auto font-base text-xs mr-1 cursor-pointer">
                        UX Design
                      </div>
                      <div className="text-gray-400 font-thin w-auto text-xs">
                        • 30 seconds ago
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="border-b-0 border-gray-100"></div>
              <div className="text-gray-400 font-medium text-sm mb-7 mt-6 px-2">
                <img className="rounded" src={media} />
              </div>
              <div className="text-gray-600 font-semibold text-lg mb-2 mx-3 px-2">
                {cardDetails.type === communityTypes.SPOTLIGHT ? 'Spotlight' : ''}
              </div>
              <div className="text-gray-500 font-thin text-sm mb-6 mx-3 px-2">
                {cardDetails.note}
              </div>
              {/* <div className="flex justify-start mb-4 border-t border-gray-100">
                  <div className="flex w-full mt-1 pt-2 pl-5">
                    <span className="bg-white transition ease-out duration-300 hover:text-red-500 border w-8 h-8 px-2 pt-2 text-center rounded-full text-gray-400 cursor-pointer mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width="14px"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    </span>
                    <img
                      className="inline-block object-cover w-8 h-8 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                      src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <img
                      className="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                      src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <img
                      className="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                      alt=""
                    />
                    <img
                      className="inline-block object-cover w-8 h-8 -ml-2 text-white border-2 border-white rounded-full shadow-sm cursor-pointer"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="flex justify-end w-full mt-1 pt-2 pr-5">
                    <span className="transition ease-out duration-300 hover:bg-blue-50 bg-blue-100 h-8 px-2 py-2 text-center rounded-full text-blue-400 w-auto cursor-pointer mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width="14px"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </span>
                    <span className="transition ease-out duration-300 hover:bg-blue-500 bg-blue-600 h-8 px-2 py-2 text-center rounded-full text-gray-100 w-auto cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        width="14px"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </span>
                  </div>
                </div> */}
              {/* <div className="flex w-full border-t border-gray-100">
                  <div className="mt-3 mx-5 flex flex-row w-auto">
                    <div className="flex text-gray-700 font-normal text-sm rounded-md mb-2 mr-4 items-center">
                      Comments:
                      <div className="ml-1 text-gray-400 font-thin text-ms"> 30</div>
                    </div>
                    <div className="flex text-gray-700 font-normal text-sm rounded-md mb-2 mr-4 items-center">
                      Views:{' '}
                      <div className="ml-1 text-gray-400 font-thin text-ms"> 60k</div>
                    </div>
                  </div>
                  <div className="mt-3 mx-5 w-full flex justify-end">
                    <div className="flex text-gray-700 font-normal w-auto text-sm rounded-md mb-2 mr-4 items-center">
                      Likes:{' '}
                      <div className="ml-1 text-gray-400 font-thin text-ms"> 120k</div>
                    </div>
                  </div>
                </div> */}
              {cardDetails.type === communityTypes.CHECK_IT_OUT && (
                <div className="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                  <img
                    className="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
                    alt="User avatar"
                    src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-6 w-auto">
                    <button
                      type="submit"
                      className="p-1 focus:outline-none focus:shadow-none hover:text-blue-500">
                      <svg
                        className="w-6 h-6 transition ease-out duration-300 hover:text-blue-500 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </span>
                  <input
                    type="search"
                    className="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue rounded-full"
                    placeholder="Post a comment..."
                    autoComplete="off"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Card;

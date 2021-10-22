import {
  communityTypes,
  COMMUNITY_UPLOAD_KEY,
} from '@components/Community/constants.community';
import {ICommunityCard} from '@interfaces/Community.interfaces';
import {getImageFromS3Static} from '@utilities/services';
import React from 'react';
import {AiOutlineHeart, AiOutlineLike} from 'react-icons/ai';

const Card = ({cardDetails}: {cardDetails: ICommunityCard}): JSX.Element => {
  const media = getImageFromS3Static(COMMUNITY_UPLOAD_KEY + cardDetails.cardImageLink);

  return (
    <div className="">
      <div className="flex max-w-xl bg-gray-100 shadow-md rounded-lg overflow-hidden mx-auto">
        <div className="flex items-center w-full">
          <div className="w-full">
            {cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
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
            <div className="border-b-0 border-gray-200"></div>
            <div className="text-gray-600 font-semibold text-lg my-2 mx-3 px-2">
              {cardDetails.cardType === communityTypes.SPOTLIGHT ? 'Spotlight' : ''}
            </div>
            <div className="text-gray-400 font-medium text-sm mb-7 mt-3 px-2">
              <img style={{maxHeight: '40rem'}} className="rounded" src={media} />
            </div>
            {/* <div className="text-gray-600 font-semibold text-lg mb-2 mx-3 px-2">
                {cardDetails.cardType === communityTypes.SPOTLIGHT ? 'Spotlight' : ''}
              </div> */}
            <div className="text-gray-500 font-thin text-sm mb-6 mx-3 px-2">
              {cardDetails.summary}
            </div>
            <div className="flex justify-start mb-4 border-t-0 border-gray-200">
              <div className="flex w-full mt-1 pt-2 space-x-4 pl-5">
                <div className="rounded-full p-4 bg-pink-100 hover:bg-pink-200 w-auto cursor-pointer z-100 transition-all">
                  <AiOutlineHeart className="text-pink-500 text-xl " />
                </div>
                <div className="rounded-full p-4 bg-blue-100 hover:bg-blue-200 w-auto cursor-pointer z-100 transition-all">
                  <AiOutlineLike className="text-blue-500 text-xl " />
                </div>
              </div>
            </div>
            <div className="flex w-full border-t border-gray-100">
              <div className="mt-3 mx-5 flex flex-row w-auto">
                <div className="flex text-gray-700 font-normal text-sm rounded-md mb-2 mr-4 items-center">
                  Comments:
                  <div className="ml-1 text-gray-400 font-thin text-ms"> 30</div>
                </div>
              </div>
              <div className="mt-3 mx-5 w-full flex justify-end">
                <div className="flex text-gray-700 font-normal w-auto text-sm rounded-md mb-2 mr-4 items-center">
                  Likes: <div className="ml-1 text-gray-400 font-thin text-ms"> 120k</div>
                </div>
              </div>
            </div>
            {cardDetails.cardType === communityTypes.CHECK_IT_OUT && (
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
};

export default Card;

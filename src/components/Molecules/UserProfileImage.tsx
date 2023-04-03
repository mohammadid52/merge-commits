import Loader from '@components/Atoms/Loader';
import Placeholder from '@components/Atoms/Placeholder';
import {Fragment} from 'react';
import DroppableMedia from './DroppableMedia';

// create interface for props
interface UserProfileProps {
  image: any;
  imageLoading: boolean;
  setImage: any;
  name: string;
  toggleCropper: any;
  mediaRef: any;
  imageUrl: any;
}

const UserProfileImage = ({
  image,
  imageLoading,
  setImage,
  name,
  toggleCropper,
  mediaRef,
  imageUrl
}: UserProfileProps) => {
  return (
    <div className="w-auto p-2 md:p-4 flex flex-col text-center items-center px-8">
      <div className="relative">
        {image ? (
          <div className="group hover:opacity-80 focus:outline-none focus:opacity-95">
            {!imageLoading ? (
              <Fragment>
                <DroppableMedia
                  setImage={setImage}
                  toggleCropper={toggleCropper}
                  mediaRef={mediaRef}>
                  <Placeholder size="w-20 h-20 md:w-40 md:h-40" image={imageUrl} />
                </DroppableMedia>
              </Fragment>
            ) : (
              <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-light  shadow-elem-lightI">
                <Loader />
              </div>
            )}
          </div>
        ) : (
          <DroppableMedia
            mediaRef={mediaRef}
            setImage={setImage}
            toggleCropper={toggleCropper}>
            <div />
          </DroppableMedia>
        )}
      </div>
      {/* <p className="text-medium  my-2">
        {dashboardProfileDict[userLanguage]['PROFILE_INSTRUCTON']}{' '}
      </p> */}
      <div className={`text-sm md:text-xl font-bold text-darkest   mt-2 md:mt-4 w-52`}>
        {name}
      </div>
    </div>
  );
};

export default UserProfileImage;

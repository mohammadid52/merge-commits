import {COMMUNITY_UPLOAD_KEY} from 'components/Community/constants.community';
import {ICommunityCard} from 'interfaces/Community.interfaces';
import {getImageFromS3Static} from 'utilities/services';
import React from 'react';
import ReactPlayer from 'react-player';

const HandleMedia = ({cardDetails}: {cardDetails: ICommunityCard}) => {
  const media = React.useMemo(
    () =>
      cardDetails?.cardImageLink
        ? getImageFromS3Static(COMMUNITY_UPLOAD_KEY + cardDetails?.cardImageLink)
        : null,
    [cardDetails?.cardImageLink]
  );

  const externalMedia = React.useMemo(
    () =>
      cardDetails?.additionalLinks &&
      cardDetails?.additionalLinks.length > 0 &&
      cardDetails?.additionalLinks[0],
    [cardDetails?.additionalLinks]
  );

  return media ? (
    <img style={{maxHeight: '40rem'}} className="rounded" src={media} />
  ) : (
    <div className="h-132 max-h-132">
      {externalMedia && (
        <ReactPlayer controls width="100%" height="100%" url={externalMedia} />
      )}
    </div>
  );
};

export default React.memo(HandleMedia);

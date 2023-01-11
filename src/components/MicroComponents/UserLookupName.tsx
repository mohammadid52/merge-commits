import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import {useGlobalContext} from '@contexts/GlobalContext';
import {getImageFromS3} from '@utilities/services';
import React, {useEffect, useState} from 'react';
import {useRouteMatch, useHistory} from 'react-router';

const UserLookupName = ({
  item,
  isStudentRoster,
  searchTerm
}: {
  searchTerm: string;
  item: any;
  isStudentRoster: boolean;
}) => {
  const {state} = useGlobalContext();

  const match = useRouteMatch();
  const history = useHistory();

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(item.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [item.image]);

  const handleLink = (id: string) => {
    const {user} = state;

    if (isStudentRoster) {
      history.push(
        `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}/manage-users/${id}?from=dashboard`
      );
    } else {
      const url = match.url.endsWith('/') ? match.url : match.url + '/';
      history.push(`${url}${id}`);
    }
  };

  return (
    <div className="" onClick={() => handleLink(item.id)}>
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          {item.image ? (
            <img src={imageUrl} className="h-8 w-8 rounded-full" />
          ) : (
            <Placeholder
              lastName={item.lastName}
              firstName={item.firstName}
              size="h-8 w-8"
            />
          )}
        </div>
        <div className="ml-2">
          <div
            data-cy={`${item.id}`}
            className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900"
            onClick={() => handleLink(item.id)}>
            <Highlighted
              text={item.name.split(' ').join('').length > 0 ? item.name : '--'}
              highlight={searchTerm}
            />
          </div>
          <div className="text-sm leading-5 text-gray-500 break-all">
            <Highlighted text={item.email} highlight={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLookupName;

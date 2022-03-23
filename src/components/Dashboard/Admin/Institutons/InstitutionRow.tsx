import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';

import {getAsset} from '../../../../assets';
import {
  stringToHslColor,
  getHostNameFromUrl,
  initials,
  getInitialsFromString,
  formatPhoneNumber,
} from '../../../../utilities/strings';
import {getImageFromS3} from '../../../../utilities/services';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import Tooltip from '../../../Atoms/Tooltip';
import {ellipsis} from '@utilities/functions';

interface InstitutionRowProps {
  id?: string;
  name?: string;
  image?: string;
  website?: string;
  type?: string;
  phone?: string;
}

/**
 * This component represents a single row in the institutes page
 * @param instRowProps - Props which provide a single Institute object with the key/values as described in the interface above
 */

const InstitutionRow: React.FC<InstitutionRowProps> = (
  instRowProps: InstitutionRowProps
) => {
  const match = useRouteMatch();
  const history = useHistory();
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [imageUrl, setImageUrl] = useState();

  const handleInstitutionView = () => {
    history.push(`${match.url}/institution/${instRowProps.id}/edit`);
  };

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(instRowProps.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [instRowProps.image]);

  return (
    <div
      id={instRowProps.id}
      className="flex justify-between bg-white w-full border-b-0 border-gray-200">
      <div className="w-3/10 px-2 lg:px-8 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center">
            {instRowProps.image ? (
              <img src={imageUrl} className="h-8 w-8 rounded-full" />
            ) : (
              <div
                className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
                style={{
                  background: `${stringToHslColor(
                    getInitialsFromString(instRowProps.name)[0] +
                      ' ' +
                      getInitialsFromString(instRowProps.name)[1]
                  )}`,
                  textShadow: '0.1rem 0.1rem 2px #423939b3',
                }}>
                {instRowProps.name
                  ? initials(
                      getInitialsFromString(instRowProps.name)[0],
                      getInitialsFromString(instRowProps.name)[1]
                    )
                  : initials('N', 'A')}
              </div>
            )}
          </div>
          <div className="ml-2">
            <Tooltip text={instRowProps.name} placement="bottomleft">
              <div
                id={instRowProps.id}
                className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900"
                onClick={handleInstitutionView}>
                {ellipsis(instRowProps.name, 22)}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="w-1.5/10 flex justify-left items-center px-4 lg:px-8 py-4 whitespace-nowrap">
        <div className="w-16 flex justify-left text-sm leading-5 text-gray-500">
          {instRowProps.type ? instRowProps.type : '--'}
        </div>
      </div>
      <div className="w-3.5/10 flex justify-left px-4 lg:px-8 py-4 whitespace-nowrap">
        <div
          className="flex justify-left items-center cursor-pointer"
          onClick={handleInstitutionView}>
          <div
            id={instRowProps.id}
            className="w-auto text-sm leading-5 text-gray-900 hover:text-gray-600 ">
            {instRowProps.website ? getHostNameFromUrl(instRowProps.website) : '--'}
          </div>
        </div>
      </div>
      <div className="w-1.5/10 flex justify-left items-center px-4 lg:px-8 py-4 whitespace-nowrap">
        <span id={instRowProps.id} className="w-auto text-sm leading-5 text-gray-500">
          {instRowProps.phone ? formatPhoneNumber(instRowProps.phone) : '--'}
        </span>
      </div>
      <div
        className="w-1/10 flex justify-left items-center px-4 lg:px-8 py-4 cursor-pointer whitespace-nowrap text-right text-sm leading-5 font-medium"
        onClick={handleInstitutionView}>
        <div
          id={instRowProps.id}
          className={`flex justify-left ${theme.textColor[themeColor]}`}>
          Edit
        </div>
      </div>
    </div>
  );
};

export default InstitutionRow;

import useDictionary from '@customHooks/dictionary';
import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';
import {BsArrowLeft} from 'react-icons/bs';
import {useHistory} from 'react-router';

interface SectionTitleProps {
  title: React.ReactNode;
  subtitle?: string | null;
  fontSize?: string;
  fontStyle?: string;
  extraClass?: string;
  spacing?: string;
  extraContainerClass?: string;
  withButton?: React.ReactElement | boolean;
  borderBottom?: boolean;
  shadowOff?: boolean;
  backButton?: boolean;
  bgColor?: string;
  textWidth?: string;
}

const SectionTitleV3: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const {
    title,
    subtitle,
    extraClass,
    extraContainerClass,
    withButton,
    borderBottom = false,
    fontSize = 'lg',
    fontStyle = 'medium',
    shadowOff = false,
    bgColor = 'bg-white',
    backButton,
    textWidth = 'w-auto'
  } = sectProps;
  const {userLanguage} = useGlobalContext();
  const history = useHistory();
  const {CommonlyUsedDict} = useDictionary();

  return (
    <div
      style={{borderBottom: borderBottom ? `1px solid rgba(237, 242, 247,1)` : 'unset'}}
      className={`${
        withButton
          ? 'flex items-start xl:items-center gap-4 flex-col xl:flex-row  justify-between '
          : ''
      } mx-auto m-auto py-4 ${
        borderBottom
          ? `px-0 border-b-0 border-gray-200 ${
              shadowOff ? '' : 'customShadow'
            } rounded-t-xl ${bgColor} mb-0`
          : ''
      } ${extraContainerClass} w-full`}>
      <div className={`${textWidth}`}>
        {title && (
          <h2 className={`text-lg 2xl:text-${fontSize} font-${fontStyle} ${extraClass}`}>
            {title}
          </h2>
        )}

        {backButton && (
          <div
            className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => history.goBack()}>
            <span className="w-auto mr-2">
              <BsArrowLeft />
            </span>
            <div className="text-sm">
              {CommonlyUsedDict[userLanguage]['BACK_TO_LIST']}
            </div>
          </div>
        )}

        {subtitle && (
          <p className="text-sm mt-2 md:mt-0 2xl:text-base text-gray-500">{subtitle}</p>
        )}
      </div>
      {withButton}
    </div>
  );
};

export default SectionTitleV3;

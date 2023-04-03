import {Fragment} from 'react';
import {useHistory} from 'react-router';

import {getAsset} from 'assets';
import AddButton from 'atoms/Buttons/AddButton';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

interface ClassListProps {
  classes: {items: {name?: string; id: string}[]};
  instId: string;
  instName: string;
}

const ClassList = (props: ClassListProps) => {
  const {classes, instId} = props;

  const history = useHistory();
  const {clientKey, theme, userLanguage} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {Institute_class} = useDictionary();

  const createNewClass = () => {
    history.push(`/dashboard/manage-institutions/institution/${instId}/class-creation`);
  };

  return (
    <div className="pt-0 flex m-auto justify-center p-4 px-12">
      <div className="">
        {classes.items && classes.items.length > 0 ? (
          <Fragment>
            <div className="flex justify-between items-center w-full m-auto">
              <h3 className="text-lg leading-6 uppercase text-medium  w-auto">
                {Institute_class[userLanguage]['TITLE']}
              </h3>
              <AddButton
                label={Institute_class[userLanguage]['BUTTON']['ADD']}
                onClick={createNewClass}
              />
            </div>

            <div className="w-full pt-8 m-auto border-b-0 border-light">
              <div className="flex justify-between bg-lightest px-8 whitespace-nowrap">
                <div className="w-1/10 px-8 py-3  text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                  <span>{Institute_class[userLanguage]['NO']}</span>
                </div>
                <div className="w-8/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                  <span>{Institute_class[userLanguage]['CLASSNAME']}</span>
                </div>
                {/* <div className="w-4/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                      <span>Active Students</span>
                    </div> */}
                <div className="w-1/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                  <span className="w-auto">
                    {Institute_class[userLanguage]['ACTION']}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full m-auto max-h-88 overflow-y-auto">
              {classes.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex justify-between w-full px-8 py-2 whitespace-nowrap border-b-0 border-lightest ${
                    index % 2 !== 0 ? 'bg-lightest' : ''
                  }`}>
                  <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                    {index + 1}.
                  </div>

                  <div className="flex w-8/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                    {item.name ? item.name : ''}
                  </div>
                  <span
                    className={`w-1/10 cursor-pointer flex items-center text-left px-8 py-3 ${theme.textColor[themeColor]}`}
                    onClick={() =>
                      history.push(
                        `/dashboard/manage-institutions/institution/${instId}/class-edit/${item.id}`
                      )
                    }>
                    {Institute_class[userLanguage]['EDIT']}
                  </span>
                </div>
              ))}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="flex justify-center mt-8">
              <AddButton
                className="mx-4"
                label={Institute_class[userLanguage]['BUTTON']['ADD']}
                onClick={createNewClass}
              />
            </div>
            <p className="text-center p-16"> {Institute_class[userLanguage]['INFO']}</p>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ClassList;

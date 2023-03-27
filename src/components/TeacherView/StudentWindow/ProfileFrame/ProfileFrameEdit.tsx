import FormInput from '@components/Atoms/Form/FormInput';
import Selector from '@components/Atoms/Form/Selector';
import {languageList} from '@utilities/staticData';
import Buttons from 'atoms/Buttons';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

interface IProfileFrameInfo {
  user: any;
  loading: boolean;
  onChange: (e: any) => void;
  handleChangeLanguage: (lang: {label: string; value: string}) => void;
  gobackToPreviousStep: any;
  saveProfileInformation: any;
}

const ProfileFrameEdit = ({
  user,
  loading,
  onChange,
  handleChangeLanguage,
  gobackToPreviousStep,
  saveProfileInformation
}: IProfileFrameInfo) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const {userLanguage} = useGlobalContext();
  // ~~~~~~~~~~~~~~ DICTIONARY ~~~~~~~~~~~~~ //
  const {dashboardProfileDict} = useDictionary();
  const dict = dashboardProfileDict[userLanguage]['EDIT_PROFILE'];
  return (
    <div className="m-auto p-2 bg-white rounded z-50">
      {/* <div className="flex justify-end py-2 mb-2 w-full">
        <h3 className="text-sm md:text-lg leading-6 font-medium text-gray-900 uppercase">
          {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['TITLE']}
        </h3>
      </div> */}
      {/* SAVE */}
      <form>
        <div className="h-full">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-gray-900">
            <>
              <div className="sm:col-span-3 p-2">
                <FormInput
                  id="firstName"
                  label={dict['FIRST_NAME']}
                  onChange={onChange}
                  value={user.firstName}
                />
              </div>

              <div className="sm:col-span-3 p-2">
                <FormInput
                  id="lastName"
                  label={dict['LAST_NAME']}
                  onChange={onChange}
                  value={user.lastName}
                />
              </div>

              <div className="sm:col-span-3 p-2">
                <FormInput
                  id="preferredName"
                  label={dict['NICKNAME']}
                  onChange={onChange}
                  value={user.preferredName}
                />
              </div>

              <div className="sm:col-span-3 p-2">
                <Selector
                  list={languageList}
                  onChange={(_, option: any) => handleChangeLanguage(option)}
                  label={dict['LANGUAGE']}
                  selectedItem={user.language}
                  placeholder={dict['LANGUAGE']}
                />
              </div>
            </>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Buttons
            label={dashboardProfileDict[userLanguage]['EDIT_PROFILE']['CANCEL']}
            onClick={gobackToPreviousStep}
            transparent
          />
          <Buttons
            label={
              loading
                ? 'Updating...'
                : dashboardProfileDict[userLanguage]['EDIT_PROFILE']['SAVE']
            }
            onClick={saveProfileInformation}
            disabled={loading ? true : false}
          />
        </div>
      </form>
    </div>
  );
};
export default ProfileFrameEdit;

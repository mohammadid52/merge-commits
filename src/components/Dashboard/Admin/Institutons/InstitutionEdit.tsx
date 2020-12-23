import React, { useContext, useState, useEffect } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useHistory } from 'react-router-dom';

import { GlobalContext } from '../../../../contexts/GlobalContext';
import ActionButton from '../Actions/ActionButton';
import * as customMutations from '../../../../customGraphql/customMutations';
import { initials, stringToHslColor } from '../../../../utilities/strings';
import { InstitutionInfo } from './Institution';
import FormInput from '../../../Atoms/Form/FormInput';
import Loader from '../../../Atoms/Loader';
import { FaPlus } from 'react-icons/fa';
import ProfileCropModal from '../../Profile/ProfileCropModal';
//import InstitutionInfo from './InstitutionInfo';

interface InstitutionEditProps {
  institute?: InstitutionInfo;
}

const InstitutionEdit = (instEditPrps: InstitutionEditProps) => {
  const [editFormValues, setEditFormValues] = useState<InstitutionInfo>(instEditPrps.institute);
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('')
  const history = useHistory();

  async function updateInstitutionDB(): Promise<void> {
    const updatedInfo = {

    }
  }

  const handleEditFormChange = (e: React.FormEvent /* <HTMLFormElement> */) => {
    const id = (e.target as HTMLInputElement).id;
    const value = (e.target as HTMLInputElement).value;

    console.log('Inst Edit form: ', { [id]: value });

    setEditFormValues(() => ({ ...editFormValues, [id]: value }));
  };

  const handleEditFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('test form submit');
  };

  const cropSelecetedImage = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setUpImage(fileReader.result)
      }
      fileReader.readAsDataURL(file);
      toggleCropper()
    }
  }

  const toggleCropper = () => {
    setShowCropper(!showCropper)
  }

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    // await uploadImageToS3(image, person.id, 'image/jpeg')
    // const imageUrl: any = await getImageFromS3(`profile_image_${person.id}`)
    setImageUrl(imageUrl);
    // setPerson({ ...person, image: `profile_image_${person.id}` })
    // updateImageParam(`profile_image_${person.id}`);
    toggleCropper();
    setImageLoading(false);
  }

  return (

    <div className="h-9/10 flex flex-col md:flex-row">

      {/* Profile section */}
      <div className="w-auto p-4 mr-4 flex flex-col text-center items-center">
        {false ? <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
          <div className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full" style={{ background: `${stringToHslColor('I' + ' ' + 'N')}`, textShadow: '0.2rem 0.2rem 3px #423939b3' }}>
            {initials('IN', 'NI')}
          </div>
        </div> :
          <label className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
            {true ?
              <IconContext.Provider value={{ size: '3rem', color: '#4a5568' }}>
                <FaPlus />
              </IconContext.Provider> :
              <Loader />}
            <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} onClick={(e: any) => e.target.value = ''} accept="image/*" multiple={false} />
          </label>}
        <div className="text-xl font-bold font-open text-gray-900 mt-4">
          <p>
            ICONOCLAST ARTISTS
            </p>
        </div>
      </div>


      <div className={`h-full w-full pt-2`}>
        {/* FORM submit tag */}
        <form onSubmit={handleEditFormSubmit}>
          <div className={`h-full shadow-5 bg-white sm:rounded-lg mb-4`}>
            {/* TITLE */}
            <div className='w-full px-4 py-5 border-b border-gray-200 sm:px-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Edit Information
              </h3>
            </div>
            {/* FORM */}
            <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6 px-4 py-5'>
              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='name' name='name' label="Institution Name" placeHolder="i.e. Iconoclast artist" />
              </div>
              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='website' name='website' label="Website" placeHolder="i.e. Iconoclastartist.com" />
              </div>
              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='address' name='address' label="Address line 1" />
              </div>

              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='addressLine2' name='addressLine2' label="Address line 2" />
              </div>

              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='city' name='city' label="City" />
              </div>

              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='district' name='district' label="District" />
              </div>

              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='state' name='state' label="State" />
              </div>

              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='zip' name='zip' label="Zip" />
              </div>

              <div className='sm:col-span-3 px-3 py-2'>
                <FormInput id='phone' name='phone' label="Phone" />
              </div>
            </div>
          </div>

          {/* Image cropper */}
          {showCropper && (
            <ProfileCropModal upImg={upImage} saveCroppedImage={(img: string) => saveCroppedImage(img)} closeAction={toggleCropper} />
          )}

          {/* Cancel/save buttons */}
          <div className='px-4 w-full flex justify-end'>
            <div className='flex w-4/10'>
              <ActionButton
                func={history.goBack}
                label='Cancel'
                compClass='py-2 px-4 border border-gray-300 rounded-md text-m leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out'
              />
              <ActionButton
                type='submit'
                label='Save'
                compClass='inline-flex justify-center py-2 px-4 ml-3 border border-transparent text-m leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out'
              />
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

export default InstitutionEdit;

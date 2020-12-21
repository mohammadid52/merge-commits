import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPlus } from 'react-icons/fa';

import BreadCrums from '../../../Atoms/BreadCrums';
import Buttons from '../../../Atoms/Buttons';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';

interface InstitutionProps {

}

const InstitutionAdd = (props: InstitutionProps) => {

  const history = useHistory();
  const [selectedImage, setSelectedImage] = useState(null)
  const { } = props;
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Institution Management', url: '/dashboard/manage-institutions', last: false },
    { title: 'Add New Institute', url: `/dashboard/manage-institutions/add`, last: true }
  ];

  return (
    <div className="w-full h-full mt-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Institution" subtitle="Add new institution to the list" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="">
          <div className="relative">
            {selectedImage ?
              (
                <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                  {/* {!imageLoading ?  */}
                  {/* <img
                    className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full border border-gray-400 shadow-elem-light`}
                    src={imageUrl}
                  />  */}
                  {/* :
                    <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-lightI">
                      <Loader />
                    </div>
                  } */}
                  {/* <span className="hidden group-focus:flex justify-around mt-6">
                    <label className="w-8 cursor-pointer">
                      <IconContext.Provider value={{ size: '1.6rem', color: '#B22222' }}>
                        <FaEdit />
                      </IconContext.Provider>
                      <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} onClick={(e: any) => e.target.value = ''} accept="image/*" multiple={false} />
                    </label>
                    <span className="w-8 cursor-pointer" onClick={deletUserProfile}>
                      <IconContext.Provider value={{ size: '1.6rem', color: '#fa0000' }}>
                        <FaTrashAlt />
                      </IconContext.Provider>
                    </span>
                  </span> */}
                </button>) :
              (
                <label className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
                  {/* {!imageLoading ?  */}
                  <IconContext.Provider value={{ size: '3rem', color: '#4a5568' }}>
                    <FaPlus />
                  </IconContext.Provider>
                  {/* : <Loader />} */}
                  <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} onClick={(e: any) => e.target.value = ''} accept="image/*" multiple={false} />
                </label>

              )
            }
          </div>
          <div className="">

          </div>
        </div>
      </PageWrapper>

    </div>
  )
}

export default InstitutionAdd

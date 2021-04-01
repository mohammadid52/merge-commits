import React, { Fragment, useContext } from 'react'
import { useHistory } from 'react-router'

import PageWrapper from '../../../../Atoms/PageWrapper'
import Buttons from '../../../../Atoms/Buttons'
import { getAsset } from '../../../../../assets';
import { GlobalContext } from '../../../../../contexts/GlobalContext';

interface CurriculumListProps {
  curricular: { items: { name?: string, id: string }[] }
  instId: string
  instName: string
}

const CurriculumList = (props: CurriculumListProps) => {

  const { curricular, instId, instName } = props;
  const history = useHistory();
  const { clientKey, theme } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const createNewCurricular = () => {
    history.push(`/dashboard/manage-institutions/institution/curricular-creation?id=${instId}`)
  }

  const editCurrentCurricular = (id: string) => {
    history.push(`/dashboard/manage-institutions/${instId}/curricular?id=${id}`)
  }

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">{instName ? instName.toUpperCase() : 'INSTITUTE'} CURRICULA</h3>
          {(curricular.items && curricular.items.length > 0) ? (
            <Fragment>
              <div className="flex justify-end w-8/10 m-auto ">
                <Buttons btnClass="mx-4" label="Add new Curriculum" onClick={createNewCurricular} />
              </div>
              <div className="flex justify-between w-8/10 m-auto px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>No.</span>
                </div>
                <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Curriculum Name</span>
                </div>
                <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Actions</span>
                </div>
              </div>

              <div className="mb-8 w-8/10 m-auto max-h-88 overflow-y-auto">
                {curricular.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                    <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                      {item.name ? item.name : ''}
                    </div>
                    <span className={`w-3/10 h-6 flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => editCurrentCurricular(item.id)}>
                      View
                    </span>
                  </div>
                ))}
              </div>
            </Fragment>
          ) : (
              <Fragment>
                <div className="flex justify-center mt-8">
                  <Buttons btnClass="mx-4" label="Add new Curriculum" onClick={createNewCurricular} />
                </div>
                <p className="text-center p-16">  This institute does not have any curriculum. Please create a new curriculum.</p>
              </Fragment>)}
        </PageWrapper>
      </div>
    </div>
  )
}

export default CurriculumList

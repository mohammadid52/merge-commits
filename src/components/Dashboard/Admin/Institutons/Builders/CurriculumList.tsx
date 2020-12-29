import React from 'react'
import { useHistory } from 'react-router'
import PageWrapper from '../../../../Atoms/PageWrapper'
import Buttons from '../../../../Atoms/Buttons'

interface CurriculumListProps {
  curricular: { items: { name?: string, id: string }[] }
}

const CurriculumList = (props: CurriculumListProps) => {

  const { curricular } = props;
  const history = useHistory();

  const createNewCurricular = () => {
    history.push('/dashboard/manage-institutions/curricular-creation')
  }
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">INSTITUTE CURRICULAR</h3>
          <div className="flex justify-end">
            <Buttons btnClass="mx-4" label="Add new Curricular" onClick={createNewCurricular} />
          </div>

          <div className="my-8 m-auto max-h-88 overflow-y-scroll">

            <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Curricular Name</span>
              </div>
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Actions</span>
              </div>
            </div>


            {(curricular.items && curricular.items.length > 0) ? (
              curricular.items.map((item, index) => (
                <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex w-7/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                    {item.name ? item.name : ''}
                  </div>
                  <span className="w-1/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900" onClick={() => console.log('')}>
                    edit
                  </span>
                </div>

              ))
            ) : (<p className="text-center p-16"> No Results</p>)}
          </div>
        </PageWrapper>
      </div>
    </div>
  )
}

export default CurriculumList

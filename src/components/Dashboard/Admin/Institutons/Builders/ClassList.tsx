import React, { Fragment } from 'react'
import { useHistory } from 'react-router'
import PageWrapper from '../../../../Atoms/PageWrapper'
import Buttons from '../../../../Atoms/Buttons'

interface ClassListProps {
  classes: { items: { name?: string, id: string }[] }
}

const ClassList = (props: ClassListProps) => {
  const { classes } = props;
  const history = useHistory();

  const createNewClass = () => {
    history.push('/dashboard/manage-institutions/class-creation')
  }
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">INSTITUTE CLASSES</h3>

          {
            (classes.items && classes.items.length > 0) ? (
              <Fragment>
                <div className="flex justify-end">
                  <Buttons btnClass="mx-4" label="Create new class" onClick={createNewClass} />
                </div>
                <div className="my-8 m-auto max-h-88 overflow-y-auto">

                  <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Class Name</span>
                    </div>
                    {/* <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Students</span>
              </div> */}
                    <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Actions</span>
                    </div>
                  </div>
                  {classes.items.map((item, index) => (
                    <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                        {item.name ? item.name : ''}
                      </div>
                      <span className="w-3/10 h-6 cursor-pointer flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900" onClick={() => history.push(`/dashboard/manage-institutions/class-edit?id=${item.id}`)}>
                        edit
                  </span>
                    </div>
                  ))}

                </div>
              </Fragment>
            ) : (
                <Fragment>
                  <div className="flex justify-center mt-8">
                    <Buttons btnClass="mx-4" label="Create new class" onClick={createNewClass} />
                  </div>
                  <p className="text-center p-16"> This institute does not have any class. Please create a new class.</p>
                </Fragment>)}
        </PageWrapper>
      </div>
    </div>
  )
}

export default ClassList

import React from 'react'
import { useHistory } from 'react-router'
import PageWrapper from '../../../../Atoms/PageWrapper'
import Buttons from '../../../../Atoms/Buttons'

const RoomsList = () => {
  const history = useHistory();

  const createNewInstitute = () => {
    history.push('/dashboard/manage-institutions/room-creation')
  }
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">INSTITUTE ROOMS</h3>
          <div className="flex justify-end">
            <Buttons btnClass="mx-4" label="Create new Room" onClick={createNewInstitute} />
          </div>

          <div className="my-8 m-auto max-h-88 overflow-y-scroll">

            <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Room Name</span>
              </div>
              <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Max. Students</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Actions</span>
              </div>
            </div>

            <p className="text-center p-16"> No Results</p>
            {/* <div className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                Room Name
              </div>
              <div className="flex w-4/10 items-center px-8 py-3 text-left text-s leading-4">32</div>
              <span className="w-3/10 h-6 flex items-center cursor-pointer text-left px-8 py-3 text-indigo-600 hover:text-indigo-900" onClick={() => console.log('')}>
                edit
              </span>
            </div> */}

          </div>



        </PageWrapper>
      </div>
    </div>
  )
}

export default RoomsList

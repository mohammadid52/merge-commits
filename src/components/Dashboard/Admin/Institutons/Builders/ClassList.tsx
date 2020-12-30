import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import PageWrapper from '../../../../Atoms/PageWrapper'
import Buttons from '../../../../Atoms/Buttons'

interface ClassListProps {
  classes: { items: { name?: string, id: string }[] }
}

const ClassList = (props: ClassListProps) => {
  const { classes } = props;
  const [classList, setClassList] = useState([]);
  const history = useHistory();

  const createNewClass = () => {
    history.push('/dashboard/manage-institutions/class-creation')
  }

  const fetchClassList = () => {
    // try {
    //   const list: any = await API.graphql(graphqlOperation(queries.listClasss, {
    //     filter: { or: getFilterORArray(allInstiId, 'institutionID') },
    //   }));
    //   const listClass = list.data.listClasss?.items
    //   if (listClass.length === 0) {
    //     setMessages({
    //       show: true,
    //       message: 'Please add class first for the selected institute or select another institute.',
    //       isError: true
    //     })
    //   } else {
    //     const sortedList = listClass.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
    //     const classList = sortedList.map((item: any, i: any) => ({
    //       id: item.id,
    //       name: `${item.name ? item.name : ''}`,
    //       value: `${item.name ? item.name : ''}`
    //     }));
    //     setClassList(classList);
    //   }
    // } catch{
    //   setMessages({
    //     show: true,
    //     message: 'Unable to fetch class list. Please try again later.',
    //     isError: true
    //   })
    // }
  }

  // useEffect(() => {
  //   fetchClassList()
  // }, [])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">INSTITUTE CLASSES</h3>

          {
            (classes.items && classes.items.length > 0) ? (
              <Fragment>
                <div className="flex justify-end w-8/10 m-auto ">
                  <Buttons btnClass="mx-4" label="Create new class" onClick={createNewClass} />
                </div>
                <div className="my-8 w-8/10 m-auto max-h-88 overflow-y-auto">
                  <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>No.</span>
                    </div>
                    <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Class Name</span>
                    </div>
                    {/* <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Active Students</span>
                    </div> */}
                    <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Actions</span>
                    </div>
                  </div>
                  {classes.items.map((item, index) => (
                    <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>

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

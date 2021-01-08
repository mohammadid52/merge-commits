import React, { useEffect, Fragment, useState } from 'react'
import { useHistory } from 'react-router';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';

import API, { graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../../../../../graphql/queries'
import * as customQueries from '../../../../../../../customGraphql/customQueries'
interface TopicsListProps {
  topicsList?: any[]
  curricularId: string
}

const TopicsList = (props: TopicsListProps) => {
  const { curricularId } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [topics, setTopics] = useState([])

  const createNewTopic = () => {
    // need to check for route id
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/topic/add`)
  }

  const editCurrentTopic = (id: string) => {
    // need to check for route id
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/topic/edit/${id}`)
  }

  const fetchTopics = async () => {
    setLoading(true)
    let list: any = await API.graphql(graphqlOperation(customQueries.listTopics, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listTopics?.items || []
    setTopics(list)
    setLoading(false)
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CURRICULAR TOPICS</h3>
          {
            !loading ?
            <>
              {(topics && topics.length > 0) ? (
                <Fragment>
                  <div className="flex justify-end w-8/10 m-auto ">
                    <Buttons btnClass="mx-4" label="Add new Topic" onClick={createNewTopic} />
                  </div>
                  <div className="my-8 w-8/10 m-auto max-h-88 overflow-y-auto">

                    <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>No.</span>
                      </div>
                      <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>Topic Name</span>
                      </div>
                      <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>Actions</span>
                      </div>
                    </div>

                    {/* Edit as per respective topics fields.  */}
                    {topics.map((item, index) => (
                      <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                        <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                          {item.name}
                        </div>
                        <span className="w-3/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => editCurrentTopic(item.id)}>
                          edit
                  </span>
                      </div>
                    ))}
                  </div>
                </Fragment>
              ) : (
                  <Fragment>
                    <div className="flex justify-center mt-8">
                      <Buttons btnClass="mx-4" label="Add new Topic" onClick={createNewTopic} />
                    </div>
                    <p className="text-center p-16">  This curricular does not have any topics. Please create a new one.</p>
                  </Fragment>)}
            </> : <div>Loading...</div>
          }
        </PageWrapper>
      </div>
    </div>
  )
}

export default TopicsList

import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';

import TopicsListComponent from './TopicsList';
import { reorder } from '../../../../../../../utilities/strings';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import DragableAccordion from '../../../../../../Atoms/DragableAccordion';
import Buttons from '../../../../../../Atoms/Buttons';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import { GlobalContext } from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';

interface LearningObjectiveListProps {
  curricularId: string
}

const LearningObjectiveList = (props: LearningObjectiveListProps) => {
  const { curricularId } = props;
  const [loading, setLoading] = useState(false)
  const [learnings, setLearnings] = useState([])
  const [learningIds, setLearningIds] = useState([])
  const { clientKey, userLanguage, theme } = useContext(GlobalContext);
  const { LEARINGOBJECTIVEDICT,BreadcrumsTitles } = useDictionary(clientKey);

  const history = useHistory();

  const onDragEnd = async (result: any) => {
    try {
      if (result.source.index !== result.destination.index) {
        const list = reorder(learningIds, result.source.index, result.destination.index)
        setLearningIds(list)
        let learningsList = learnings.map((t: any) => {
          let index = list.indexOf(t.id)
          return { ...t, index }
        }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
        setLearnings(learningsList)
        let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `l_${curricularId}`, sequence: list } }));
        seqItem = seqItem.data.updateCSequences;
        console.log('seq updated');
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  const createLearningObjective = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/learning-objective/add`)
  }
  const editLearningObj = (learningId: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/learning-objective/edit/${learningId}`)
  }

  const fetchLearningObjs = async () => {
    setLoading(true)
    let [list, seq]: any = await Promise.all([
      await API.graphql(graphqlOperation(queries.listLearningObjectives, {
        filter: { curriculumID: { eq: curricularId } },
      })),
      await API.graphql(graphqlOperation(queries.getCSequences,
        { id: `l_${curricularId}` }))
    ]);
    seq = seq?.data?.getCSequences?.sequence || []
    list = list?.data?.listLearningObjectives?.items || []

    const sequenceLength = seq?.length;
    const listLength = list?.length;
    list = list.map((t: any) => {
      let index = seq.indexOf(t.id)
      return {
        id: t.id,
        title: t.name,
        content: <TopicsListComponent curricularId={curricularId} learningId={t.id} />,
        index
      }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
    setLearnings(list)
    setLearningIds(seq)

    if (listLength && !sequenceLength) {
      let learningsID = list.map((item: { id: string }) => item.id)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `l_${curricularId}`, sequence: learningsID } }));
      seqItem = seqItem.data.createCSequences
      setLearningIds(learningsID)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLearningObjs()
  }, [])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">{LEARINGOBJECTIVEDICT[userLanguage]['TITLE']}</h3>
          {
            !loading ? ((learnings && learnings.length > 0) ? (
              <Fragment>
                <div className="flex justify-end w-9/10 m-auto ">
                  <Buttons btnClass="" label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']} onClick={createLearningObjective} />
                </div>
                <div className="py-4">
                  <DragableAccordion titleList={learnings} onDragEnd={onDragEnd} showEdit onItemEdit={editLearningObj} />
                </div>
              </Fragment>
            ) : (
                <Fragment>
                  <div className="flex justify-center mt-8">
                    <Buttons btnClass="mx-4" label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']} onClick={createLearningObjective} />
                  </div>
                  <p className="text-center p-16"> {LEARINGOBJECTIVEDICT[userLanguage]['INFO']}</p>
                </Fragment>)) : (
                <div className="py-12 my-12 m-auto text-center">{LEARINGOBJECTIVEDICT[userLanguage]['FETCH']}</div>
              )}
        </PageWrapper>
      </div>
    </div>
  )
}

export default LearningObjectiveList
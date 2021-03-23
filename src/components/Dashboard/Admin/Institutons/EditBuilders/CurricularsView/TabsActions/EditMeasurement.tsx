import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router'
import { IoArrowUndoCircleOutline } from 'react-icons/io5'
import API, { graphqlOperation } from '@aws-amplify/api';
import BreadCrums from '../../../../../../Atoms/BreadCrums'
import SectionTitle from '../../../../../../Atoms/SectionTitle'
import Buttons from '../../../../../../Atoms/Buttons'
import PageWrapper from '../../../../../../Atoms/PageWrapper'
import FormInput from '../../../../../../Atoms/Form/FormInput'
import TextArea from '../../../../../../Atoms/Form/TextArea'
import Selector from '../../../../../../Atoms/Form/Selector'

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../customGraphql/customMutations';
import { GlobalContext } from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';

interface EditMeasurementProps {

}

const EditMeasurement = (props: EditMeasurementProps) => {
  const { } = props;
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;
  const measurementId = urlParams.id;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({ name: '', topic: '' })
  const [topics, setTopics] = useState([]);
  const { theme, clientKey,userLanguage } = useContext(GlobalContext);
  const {EditMeasurementDict, BreadcrumsTitles } = useDictionary(clientKey);
  const [measurement, setMeasurement] = useState({
    id: measurementId, name: '', curriculumID: curricularId, topic: { id: '', name: '', value: '' },
    criteria: '', distinguished: '', basic: '', adequite: '', excelled: ''
  })

  const breadCrumsList = [
    { title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
    { title: BreadcrumsTitles[userLanguage]['EditMeasurement'], url: `/dashboard/curricular/${curricularId}/measurement/edit/${measurementId}'}`, last: true }
  ];

  const onInputChange = (e: any) => {
    const value = e.target.value
    if (e.target.name === 'name') {
      setMeasurement({ ...measurement, name: value })
      if (value.length && validation.name) setValidation({ ...validation, name: '' })
    } else {
      setMeasurement({ ...measurement, [e.target.name]: value })
    }
  }

  const selectTopic = (val: string, name: string, id: string) => {
    if (validation.topic) {
      setValidation({ ...validation, topic: '' })
    }
    setMeasurement({ ...measurement, topic: { ...measurement.topic, id, name, value: val } })
  }

  const fetchTopics = async () => {
    let list: any = await API.graphql(graphqlOperation(queries.listTopics, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listTopics?.items || []
    list = list.map((item: any) => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    setTopics(list)
  }

  const fetchMeasurement = async () => {
    setLoading(true)
    let item: any = await API.graphql(graphqlOperation(customQueries.getRubric, { id: measurementId }));
    item = item.data.getRubric
    if (item?.curriculumID === curricularId) {
      setMeasurement({
        ...measurement,
        name: item.name,
        topic: { id: item.topic.id, name: item.topic.name, value: item.topic.name },
        criteria: item.criteria,
        distinguished: item.distinguished,
        adequite: item.adequite,
        excelled: item.excelled,
        basic: item.basic
      })
      setLoading(false)
    } else {
      console.log('wrong cr')
      setLoading(false)
    }
  }

  const validateForm = () => {
    let isValid = true
    const msgs = validation;
    if (!measurement.name.length) {
      isValid = false;
      msgs.name = EditMeasurementDict[userLanguage]['messages']['namerequired'];
    } else {
      msgs.name = ''
    }
    if (!measurement.topic.id) {
      isValid = false;
      msgs.topic = EditMeasurementDict[userLanguage]['messages']['topicrequired'];
    } else {
      msgs.topic = ''
    }
    setValidation({ ...msgs });
    return isValid;
  }

  const saveMeasurementDetails = async () => {
    const isValid = validateForm()
    if (isValid) {
      const input = {
        id: measurement.id,
        name: measurement.name,
        criteria: measurement.criteria,
        distinguished: measurement.distinguished,
        basic: measurement.basic,
        adequite: measurement.adequite,
        excelled: measurement.excelled,
        topicID: measurement.topic.id,
        curriculumID: curricularId
      };
      const item: any = await API.graphql(graphqlOperation(customMutations.updateRubric, { input }));
      const updatedItem = item.data.updateRubric
      if (updatedItem) {
      history.goBack()
      } else {
        console.log('Could not update topic');
      }
    }
  }

  useEffect(() => {
    fetchTopics()
    fetchMeasurement()
  }, [])

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title={EditMeasurementDict[userLanguage]['title']} subtitle={EditMeasurementDict[userLanguage]['subtitle']} />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">{EditMeasurementDict[userLanguage]['heading']}</h3>
        </div>
        {
          !loading ?
            <>
              <div className="w-6/10 m-auto">
                <div className="">
                  <div className="px-3 py-4">
                    <FormInput id='name' value={measurement.name} onChange={onInputChange} name='name' label={EditMeasurementDict[userLanguage]['labelmeasur']} isRequired />
                  </div>
                  <div className="px-3 py-4">
                    {/* <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      Select Sequence
                    </label>
                    <Selector selectedItem={measurement.topic.value} placeholder="topic" list={topics} onChange={selectTopic} />
                  </div> */}
                    <div>
                      <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                        {EditMeasurementDict[userLanguage]['seltopic']}
                    </label>
                      <Selector selectedItem={measurement.topic.value} placeholder={EditMeasurementDict[userLanguage]['topic']} list={topics} onChange={selectTopic} />
                    </div>
                  </div>

                  <div className="px-3 py-4">
                    <TextArea rows={3} id='criteria' value={measurement.criteria} onChange={onInputChange} name='criteria' label={EditMeasurementDict[userLanguage]['criteria']} />
                  </div>
                  {/* <div className="px-3 py-4">
                    <TextArea rows={3} id='distinguished' value={measurement.distinguished} onChange={onInputChange} name='distinguished' label="Distinguished" />
                  </div>
                  <div className="px-3 py-4">
                    <TextArea rows={3} id='excelled' value={measurement.excelled} onChange={onInputChange} name='excelled' label={EditMeasurementDict[userLanguage]['excell']} />
                  </div>
                  <div className="px-3 py-4">
                    <TextArea rows={3} id='adequite' value={measurement.adequite} onChange={onInputChange} name='adequite' label={EditMeasurementDict[userLanguage]['adequite']} />
                  </div>
                  <div className="px-3 py-4">
                    <TextArea rows={3} id='basic' value={measurement.basic} onChange={onInputChange} name='basic' label="Basic" />
                  </div> */}
                </div>
              </div>
              <div className="flex my-8 justify-center">
                <Buttons btnClass="py-3 px-10 mr-4" label={EditMeasurementDict[userLanguage]['button']['cancel']} onClick={history.goBack} transparent />
                <Buttons btnClass="py-3 px-10 ml-4" label={EditMeasurementDict[userLanguage]['button']['save']} onClick={saveMeasurementDetails} />
              </div>
            </> : <div className="py-12 my-12 m-auto text-center">{EditMeasurementDict[userLanguage]['fetching']}</div>
        }
      </PageWrapper>
    </div>
  )
}

export default EditMeasurement

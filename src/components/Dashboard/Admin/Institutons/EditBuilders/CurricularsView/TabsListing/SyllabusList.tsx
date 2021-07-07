import React, {Fragment, useEffect, useState, useContext} from 'react';
import {useHistory} from 'react-router';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import API, {graphqlOperation} from '@aws-amplify/api';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';
import {reorder} from '../../../../../../../utilities/strings';
import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import {getAsset} from '../../../../../../../assets';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';
import Tooltip from '../../../../../../Atoms/Tooltip';

interface SyllabusListProps {
  curricularId?: string;
  institutionId: string;
}

const SyllabusList = (props: SyllabusListProps) => {
  const {curricularId, institutionId} = props;

  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const SyllabusDict = useDictionary(clientKey).SYLLABUS;

  const [loading, setLoading] = useState(false);
  const [syllabusList, setSyllabusList] = useState([]);

  const fetchSyllabusList = async () => {
    let list: any = await API.graphql(
      graphqlOperation(queries.listUniversalSyllabuss, {
        filter: {
          curriculumID: {eq: curricularId}
        },
      })
    );
    console.log('list', list)
  }
  useEffect(() => {
    fetchSyllabusList()
  }, [])
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {SyllabusDict[userLanguage]['TITLE']}
          </h3>
          {
            loading && (
              <p className="text-center p-16"> {SyllabusDict[userLanguage]['FETCH']}</p>
            )
          }
          {
            !loading &&
            <Fragment>

            </Fragment>
          }
        </PageWrapper>
      </div>
    </div>
  );
};

export default SyllabusList;

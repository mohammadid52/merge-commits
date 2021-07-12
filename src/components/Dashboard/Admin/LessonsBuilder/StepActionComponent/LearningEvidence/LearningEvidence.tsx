import React, {useContext, useState} from 'react';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import Accordion from '../../../../../Atoms/Accordion';
import PageWrapper from '../../../../../Atoms/PageWrapper';

import MeasurementsList from './MeasurementsList';

const LearningEvidence = () => {
  const {clientKey} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  const units = [
    {id: '1', name: 'Introduction to ICONOCLAST Artist'},
    {id: '2', name: 'ICONOCLAST Artist Summer Program'},
  ];

  const renderTableView = () => {
    return <MeasurementsList />;
  };
  const titleList = units.map((unit, index) => ({
    id: index,
    title: unit.name,
    content: renderTableView(),
  }));
  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-8 border-0 border-gray-200">
          <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
            <Accordion
              titleList={titleList}
              // titleList={[
              //   {
              //     id: '1',
              //     title: 'Introduction to ICONOCLAST Artist',
              //     content: <>Hello</>,
              //   },
              //   {
              //     id: '2',
              //     title: 'ICONOCLAST Artist Summer Program',
              //     content: <>Hello</>,
              //   },
              // ]}
            />
          </div>
        </PageWrapper>
        {/* {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Lesson to Course'}
            closeOnBackdrop
            closeAction={() => setAddModalShow(false)}>
            <div className="min-w-256">
              <AddCourse />
            </div>
          </Modal>
        )} */}
      </div>
    </div>
  );
};

export default LearningEvidence;

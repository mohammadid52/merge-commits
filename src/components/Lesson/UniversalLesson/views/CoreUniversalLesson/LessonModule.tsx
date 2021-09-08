import React, {useState} from 'react';
import {UniversalLesson} from '../../../../../API';
import ThemeModal from '../../../../Molecules/ThemeModal';
import {Tabs3, useTabs} from '../../../UniversalLessonBuilder/UI/UIComponents/Tabs';
import ReactHtmlParser from 'react-html-parser';
import {Transition} from '@headlessui/react';
import Table from '../../../../Molecules/Table';
import map from 'lodash/map';

const LessonModule = ({currentLesson}: {currentLesson: UniversalLesson}) => {
  const [open, setOpen] = useState(true);
  const tabs = [
    {name: 'Objectives', current: true},
    {name: 'Resources', current: false},
    {name: 'Evidences', current: false},
  ];

  const {curTab, setCurTab} = useTabs(tabs);

  const dataList = map(currentLesson?.lessonPlan, (lesson) => ({
    label: lesson.label,
    time: `${lesson.estTime} min`,
    overview: lesson.description ? ReactHtmlParser(lesson.description) : '--',
  }));

  const tableConfig = {
    headers: ['Label', 'Time', 'Overview'],
    dataList,
  };

  return (
    <ThemeModal
      subHeader={currentLesson?.summary}
      header={currentLesson?.title}
      open={open}
      setOpen={setOpen}>
      <div>
        <div className="my-2 border-b-0 border-gray-700 py-4 min-h-56">
          <Tabs3 setCurTab={setCurTab} curTab={curTab} tabs={tabs} />

          <div className="mt-4">
            <Transition
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="translate-x-full opacity-0"
              show={curTab === 'Objectives'}>
              <div>
                <p className="text-gray-400 font-medium text-lg leading-3">
                  {currentLesson?.objectives[0]
                    ? ReactHtmlParser(currentLesson?.objectives[0])
                    : 'No objectives'}
                </p>
              </div>
            </Transition>
            <Transition
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="translate-x-full opacity-0"
              show={curTab === 'Resources'}>
              <div>
                <p className="text-gray-400 font-medium text-lg leading-3">
                  {currentLesson?.resources ? currentLesson?.resources : 'No Resources'}
                </p>
              </div>
            </Transition>
            <Transition
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="translate-x-full opacity-0"
              show={curTab === 'Evidences'}>
              <div>
                <p className="text-gray-400 font-medium text-lg leading-3">
                  {'No Evidences'}
                </p>
              </div>
            </Transition>
          </div>
        </div>
        <div className="min-h-56 py-4">
          <Table {...tableConfig} />
        </div>
      </div>
    </ThemeModal>
  );
};

export default LessonModule;

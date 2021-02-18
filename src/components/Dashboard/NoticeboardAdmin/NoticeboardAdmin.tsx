import React, { useContext, useEffect, useState } from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from '../Anthology/SubSectionTabs';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as customMutations from '../../../customGraphql/customMutations';
import useDictionary from '../../../customHooks/dictionary';
import NoticeboardAdminContent from './NoticeboardAdminContent';

export interface NoticeboardAdmin {

}

export interface NoticeboardWidgetMapItem {
  id: string;
  teacherID: string;
  placement: 'sidebar' | 'topbar';
  title: string;
  description: string;
  content: string;
  image: string;
  active: boolean;
}

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | '';
  widgetID: string;
}

const NoticeboardAdmin = (props: NoticeboardAdmin) => {
  const {} = props;
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const {} = useDictionary(clientKey);

  // For switching sections & knowing which field to edit
  const [subSection, setSubSection] = useState<string>('Sidebar Widgets');
  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({ mode: '', widgetID: '' });


  // Function group to handle updating student data
  const handleEditUpdate = (e: React.ChangeEvent) => {
    const { id, value } = e.target as HTMLInputElement;
    const [key, type, widgetID] = id.split('_');

    console.log('update --> ', widgetID);
  };


  const handleEditToggle = (editMode: ViewEditMode['mode'], widgetID: string) => {
    setViewEditMode({ mode: editMode, widgetID: widgetID });
  };


  // Function group to handle section-switching
  const handleTabClick = (e: React.MouseEvent) => {
    const { id } = e.target as HTMLElement;

    if (id !== subSection) {
      if (id !== 'subSectionTabs') {
        setSubSection(id);
      }
    }
  };


  const subSectionKey: any = {
    'Top Widgets': 'topbar',
    'Sidebar Widgets': 'sidebar',
  };

  const widgetData = [
    {
      id: '1',
      teacherID: 'teacher_1',
      placement: 'sidebar',
      title: 'title_1',
      description: 'short description 1',
      content: 'here is some content',
      image: '',
      active: true,
    }, {
      id: '2',
      teacherID: 'teacher_1',
      placement: 'sidebar',
      title: 'title_2',
      description: 'short description 2',
      content: 'here is some content',
      image: '',
      active: true,
    }, {
      id: '3',
      teacherID: 'teacher_1',
      placement: 'sidebar',
      title: 'title_3',
      description: 'short description 3',
      content: 'here is some content',
      image: '',
      active: false,
    }, {
      id: '4',
      teacherID: 'teacher_1',
      placement: 'topbar',
      title: 'title_4',
      description: 'short description 4',
      content: 'here is some content',
      image: '',
      active: true,
    },
  ];

  const filterWidgetContentBySubsection = widgetData.filter((widgetObj: NoticeboardWidgetMapItem) => {
    if(widgetObj.placement === subSectionKey[subSection]) return widgetObj;
  })

  return (
    <React.Fragment>
      <SectionTitle title={`Noticeboard Admin`} />

      {/*
      Tabs to select between:
        - Top widgets
        - Sidebar widgets
    */}
      <SubSectionTabs subSection={subSection} subSectionList={['Top Widgets', 'Sidebar Widgets']}
                      handleTabClick={handleTabClick} />

      <NoticeboardAdminContent viewEditMode={viewEditMode} handleEditToggle={handleEditToggle}
                               handleEditUpdate={handleEditUpdate} subSection={subSection} content={widgetData.length > 0 && filterWidgetContentBySubsection} />

    </React.Fragment>
  );
};

export default NoticeboardAdmin;
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
import { AnthologyMapItem } from '../Anthology/Anthology';

export interface NoticeboardAdmin {

}

export interface Quote {
  text: string;
  author: String;
}

export interface NoticeboardWidgetMapItem {
  id: string;
  teacherID: string;
  type: string;
  placement: string;
  title: string;
  description: string;
  content?: { text: string; image: string; };
  quotes?: Quote[];
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
  const [widgetData, setWidgetData] = useState<NoticeboardWidgetMapItem[]>([]);
  const [newWidgetData, setNewWidgetData] = useState<NoticeboardWidgetMapItem>();

  // For switching sections & knowing which field to edit
  const [subSection, setSubSection] = useState<string>('Sidebar Widgets');
  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({ mode: '', widgetID: '' });

  useEffect(() => {
    const widgetFetchData = [
      {
        id: '1',
        teacherID: 'teacher_1',
        type: 'default',
        placement: 'sidebar',
        title: 'title_1',
        description: 'short description 1',
        content: {
          text: 'any content text',
          image: '',
        },
        active: true,
      }, {
        id: '2',
        teacherID: 'teacher_1',
        type: 'default',
        placement: 'sidebar',
        title: 'title_2',
        description: 'short description 2',
        content: {
          text: 'any content text',
          image: '',
        },
        active: true,
      }, {
        id: '3',
        teacherID: 'teacher_1',
        type: 'default',
        placement: 'sidebar',
        title: 'title_3',
        description: 'short description 3',
        content: {
          text: 'any content text',
          image: '',
        },
        active: false,
      }, {
        id: '4',
        teacherID: 'teacher_1',
        type: 'default',
        placement: 'topbar',
        title: 'title_4',
        description: 'short description 4',
        content: {
          text: 'any content text',
          image: '',
        },
        active: true,
      }, {
        id: '5',
        teacherID: 'teacher_1',
        type: 'quote',
        placement: 'topbar',
        title: 'title_5_quotes',
        description: 'quote description',
        content: {
          text: 'any content text',
          image: '',
        },
        quotes:
          [
            {
              text: 'quote 1',
              author: 'quote author 1',
            },
            {
              text: 'quote 2',
              author: 'quote author 2',
            },
            {
              text: 'quote 3',
              author: 'quote author 3',
            },
          ],
        active: true,
      },
    ];
    setWidgetData(widgetFetchData);
  }, []);

  // Function group to handle updating student data
  const handleEditUpdate = (e: React.ChangeEvent) => {
    const target = e.target as any;
    const { id, value } = target;
    const basekey = e.target.getAttribute('data-basekey');
    const nestkey1 = e.target.getAttribute('data-nestkey1');
    const nestkey2 = e.target.getAttribute('data-nestkey2');

    switch (viewEditMode.mode) {
      case 'edit':
        const updatedWidgetData = widgetData.reduce((acc: NoticeboardWidgetMapItem[], widgetObj: any) => {
          if (widgetObj.id === id) {
            if (basekey && nestkey1) {
              if (Array.isArray(widgetObj[basekey])) {
                return [...acc, {
                  ...widgetObj, [basekey]:
                    widgetObj[basekey].map((nestedObj: any, idx: number) => {
                      if (idx === parseInt(nestkey2)) {
                        return { ...nestedObj, [nestkey1]: value };
                      } else {
                        return nestedObj;
                      }
                    }),

                }];
              }
              if (typeof widgetObj[basekey] === 'object' && Object.keys(widgetObj[basekey]).length > 0 && !Array.isArray(widgetObj[basekey])) {
                return [...acc, { ...widgetObj, [basekey]: { [nestkey1]: value } }];
              }
            } else {
              return [...acc, { ...widgetObj, [basekey]: value }];
            }
          } else {
            return [...acc, widgetObj];
          }
        }, []);
        setWidgetData(updatedWidgetData);
        break;
      case 'create':
        if (viewEditMode.mode === 'create') {
          const updatedNewWidgetData = { ...newWidgetData, [basekey]: value };
          setNewWidgetData(updatedNewWidgetData);
        }
        break;
    }
  };


  const handleEditToggle = (editMode: ViewEditMode['mode'], widgetID: string) => {
    setViewEditMode({ mode: editMode, widgetID: widgetID });
  };

  const handleActivation = (id: string) => {
    const updatedWidgetData = widgetData.reduce((acc: NoticeboardWidgetMapItem[], widgetObj: any) => {
      if (widgetObj.id === id) {
        return [...acc, { ...widgetObj, active: !widgetObj.active }];
      } else {
        return [...acc, widgetObj];
      }
    }, []);
    setWidgetData(updatedWidgetData);
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


  const filterWidgetContentBySubsection = widgetData.filter((widgetObj: NoticeboardWidgetMapItem) => {
    if (widgetObj.placement === subSectionKey[subSection]) return widgetObj;
  });

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
                               handleEditUpdate={handleEditUpdate} handleActivation={handleActivation}
                               subSection={subSection}
                               content={widgetData.length > 0 && filterWidgetContentBySubsection} />

    </React.Fragment>
  );
};

export default NoticeboardAdmin;
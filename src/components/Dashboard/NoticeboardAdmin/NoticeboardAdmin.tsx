import React, { useContext, useEffect, useState } from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from '../Anthology/SubSectionTabs';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import useDictionary from '../../../customHooks/dictionary';
import NoticeboardAdminContent from './NoticeboardAdminContent';
import RoomSwitch from './RoomSwitch';

import {Widget as NoticeboardWidgetMapItem} from '../../../interfaces/ClassroomComponentsInterfaces';

export interface NoticeboardAdmin {}
//
// export interface NoticeboardWidgetMapItem {
//   id?: string;
//   teacherAuthID: string;
//   teacherEmail: string;
//   roomID: string;
//   type: string;
//   placement: string;
//   title: string;
//   description: string;
//   content?: { text: string; image: string };
//   quotes?: Quote[];
//   active: boolean;
// }

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | '';
  widgetID: string;
};

const NoticeboardAdmin = (props: NoticeboardAdmin) => {
  const {} = props;
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const {} = useDictionary(clientKey);
  //
  const [activeRoom, setActiveRoom] = useState<string>('');
  const [activeRoomName, setActiveRoomName] = useState<string>('');
  //
  const [loading, setLoading] = useState<boolean>(false);
  //
  const [widgetData, setWidgetData] = useState<NoticeboardWidgetMapItem[]>([]);
  const [newWidgetData, setNewWidgetData] = useState<NoticeboardWidgetMapItem | any>({
    teacherAuthID: '',
    teacherEmail: '',
    roomID: '',
    type: 'default',
    placement: 'sidebar',
    title: '',
    description: '',
    content: { text: '', image: '' },
    quotes: [],
    links: [],
    active: true,
  });

  // For switching sections & knowing which field to edit
  const [subSection, setSubSection] = useState<string>('Sidebar Widgets');

  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({ mode: '', widgetID: '' });

  //  TOP Function to load widgets
  const listNoticeboardWidgets = async () => {
    setLoading(true);
    try {
      const noticeboardWidgetsFetch: any = await API.graphql(
        graphqlOperation(queries.listNoticeboardWidgets, { filter: { roomID: { eq: activeRoom } } })
      );
      const response = await noticeboardWidgetsFetch;
      const arrayOfResponseObjects = response?.data?.listNoticeboardWidgets?.items;
      console.log('listNoticebaordWidgets -> ', arrayOfResponseObjects);
      setWidgetData(arrayOfResponseObjects);
    } catch (e) {
      console.error('listNoticeboardWidgetsFetch: -> ', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeWidgetData = async () => {
      if (state.user.authId) {
        await listNoticeboardWidgets();
      }
    };
    if (activeRoom !== '' && loading === false) {
      initializeWidgetData();
    }
  }, [activeRoom]);

  /*
   * Function group to handle updating widget data
   *
   * Explanation:
   *   A widget object can have multiple levels of nesting
   *     = basekey => first object property
   *       = nestkey1 => first nested property
   *         = nestkey2 => second nester property
   * */
  const handleEditUpdateQuotes = (e: React.ChangeEvent) => {
    const target = e.target as any;
    const { id, value } = target;
    const basekey = e.target.getAttribute('data-basekey');
    const nestkey1 = e.target.getAttribute('data-nestkey1');
    const nestkey2 = e.target.getAttribute('data-nestkey2');

    switch (viewEditMode.mode) {
      case 'edit':
        const updatedWidgetData = widgetData.reduce((acc: NoticeboardWidgetMapItem[], widgetObj: any) => {
          if (widgetObj.id === id) {
            return [
              ...acc,
              {
                ...widgetObj,
                [basekey]: widgetObj[basekey].map((nestedObj: any, idx: number) => {
                  if (idx === parseInt(nestkey2)) {
                    return { ...nestedObj, [nestkey1]: value };
                  } else {
                    return nestedObj;
                  }
                }),
              },
            ];
          } else {
            return [...acc, widgetObj];
          }
        }, []);
        setWidgetData(updatedWidgetData);
        break;
      case 'create':  // final step to saving author!
        const updatedNewWidgetData = {
          ...newWidgetData,
          [basekey]: newWidgetData[basekey].map((nestedObj: any, idx: number) => {
            if (idx === parseInt(nestkey2)) {
              return { ...nestedObj, [nestkey1]: value };
            } else {
              return nestedObj;
            }
          }),
        };
        setNewWidgetData(updatedNewWidgetData);
        break;
      default:
        console.log('handleEditUpdateQuotes - ', 'nothing to update...');
    }
  };

  const handleEditUpdateDefault = (e: React.ChangeEvent) => {
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
              return [...acc, { ...widgetObj, [basekey]: { [nestkey1]: value } }];
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
        const updatedNewWidgetData = { ...newWidgetData, [basekey]: value };
        setNewWidgetData(updatedNewWidgetData);
        break;
    }
  };

  /*
   * Function group to handle updating widget data with the WYSIWYG editor
   *
   * Explanation:
   *   A widget object can have multiple levels of nesting
   *     = basekey => first object property
   *       = nestkey1 => first nested property
   *         = nestkey2 => second nester property
   * */
  const handleEditUpdateWYSIWYG = (id: string, value: string, basekey: string, nestkey1: string, nestkey2: string) => {
    console.log('handleEdit -> ',[id, value, basekey, nestkey1, nestkey2])
    switch (viewEditMode.mode) {
      case 'create':
        if (viewEditMode.mode === 'create') {
          if (basekey !== '') {
            if (nestkey1 !== '') {
              if (nestkey2 !== '') {
                const updatedNewWidgetData = {
                  ...newWidgetData,
                  [basekey]: {
                    // @ts-ignore
                    ...newWidgetData[basekey],
                    // @ts-ignore
                    [nestkey1]: { ...newWidgetData[basekey][nestkey1], [nestkey2]: value },
                  },
                };
                setNewWidgetData(updatedNewWidgetData);
              } else {
                // @ts-ignore
                const updatedNewWidgetData = {
                  ...newWidgetData,
                  // @ts-ignore
                  [basekey]: { ...newWidgetData[basekey], [nestkey1]: value },
                };
                setNewWidgetData(updatedNewWidgetData);
              }
            } else {
              const updatedNewWidgetData = { ...newWidgetData, [basekey]: value };
              setNewWidgetData(updatedNewWidgetData);
            }
          } else {
            console.error('create err0r -> ', ' no basekey provided for update function...');
          }
        }
        break;
      default:
        console.log('handleWYSIWYGudpate ->', 'pfft');
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

  const noticeboardUpdate = async () => {
    const getWidgetObj = widgetData.find((widgetObj: any) => widgetObj.id === viewEditMode.widgetID);
    const input = {
      id: getWidgetObj.id,
      active: getWidgetObj.active,
      placement: getWidgetObj.placement,
      quotes: getWidgetObj.quotes,
      links: getWidgetObj.links,
      content: getWidgetObj.content,
      description: getWidgetObj.description,
      title: getWidgetObj.title,
      type: getWidgetObj.type,
      /**
       * description & content ?
       */
    };
    try {
      const noticeboardWidgetUpdate: any = await API.graphql(
        graphqlOperation(mutations.updateNoticeboardWidget, {
          input: input,
        })
      );
    } catch (e) {
      console.error('noticeboardWidgetUpdate: widget: ', e);
    } finally {
      setViewEditMode({ mode: '', widgetID: '' });
    }
  };

  const noticeboardCreate = async () => {
    const input = {
      ...newWidgetData,
      teacherAuthID: state.user.authId,
      teacherEmail: state.user.email,
      roomID: activeRoom,
      placement: subSectionKey[subSection],
    };
    console.log('creating widget...', input)
    try {
      const noticeboardWidgetCreate: any = await API.graphql(
        graphqlOperation(mutations.createNoticeboardWidget, {
          input: input,
        })
      );
    } catch (e) {
      console.error('noticeboardWidgetCreate: widget: ', e);
    } finally {
      setViewEditMode({ mode: '', widgetID: '' });
    }
  };

  // UseEffect for monitoring save/create new changes and calling functions
  useEffect(() => {
    const manageSaveAndCreate = async () => {
      if (viewEditMode.mode === 'save') {
        await noticeboardUpdate();
      } else if (viewEditMode.mode === 'savenew') {
        await noticeboardCreate();
        await listNoticeboardWidgets();
      }
    };
    manageSaveAndCreate();
  }, [viewEditMode]);

  return (
    <React.Fragment>
      <SectionTitle title={`Noticeboard Room`} />

      {/*
        Boetons to select between rooms
      */}
      <RoomSwitch
        loading={loading}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        activeRoomName={activeRoomName}
        setActiveRoomName={setActiveRoomName}
      />

      <SectionTitle title={`Modify`} />

      {/*
        Tabs to select between:
          - Top widgets
          - Sidebar widgets
      */}
      <SubSectionTabs
        subSection={subSection}
        subSectionList={['Top Widgets', 'Sidebar Widgets']}
        handleTabClick={handleTabClick}
      />

      <NoticeboardAdminContent
        viewEditMode={viewEditMode}
        handleEditToggle={handleEditToggle}
        handleEditUpdateDefault={handleEditUpdateDefault}
        handleEditUpdateQuotes={handleEditUpdateQuotes}
        handleEditUpdateWYSIWYG={handleEditUpdateWYSIWYG}
        handleActivation={handleActivation}
        subSection={subSection}
        widgetData={widgetData}
        setWidgetData={setWidgetData}
        createTemplate={newWidgetData}
        setNewWidgetData={setNewWidgetData}
        content={widgetData.length > 0 && filterWidgetContentBySubsection}
      />
    </React.Fragment>
  );
};

export default NoticeboardAdmin;

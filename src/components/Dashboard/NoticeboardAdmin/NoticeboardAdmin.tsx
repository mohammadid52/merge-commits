import {API, graphqlOperation} from '@aws-amplify/api';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import {Widget as NoticeboardWidgetMapItem} from '../../../interfaces/ClassroomComponentsInterfaces';
import ContentCard from '../../Atoms/ContentCard';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from '../Anthology/SubSectionTabs';
import TopWidgetBar from '../Noticebooard/TopWidgetBar';
import NoticeboardAdminContent from './NoticeboardAdminContent';
import RoomSwitch from './RoomSwitch';

export interface NoticeboardAdmin {
  setCurrentPage: any;
}
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
  mode: 'view' | 'edit' | 'save' | 'create' | 'delete' | 'savenew' | '';
  widgetID: string;
};

const initialNewWidgetData = {
  teacherAuthID: '',
  teacherEmail: '',
  roomID: '',
  type: 'default',
  placement: 'sidebar',
  title: '',
  description: '',
  content: {text: '', image: ''},
  quotes: [{}],
  links: [{}],
  active: true,
};

const NoticeboardAdmin = (props: NoticeboardAdmin) => {
  const {theme} = useContext(GlobalContext);
  const {setCurrentPage} = props;
  const {state, dispatch, userLanguage, clientKey} = useContext(GlobalContext);
  const {noticeboardDict} = useDictionary(clientKey);
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
    content: {text: '', image: ''},
    quotes: [],
    links: [],
    active: true,
  });

  // For switching sections & knowing which field to edit
  const [subSection, setSubSection] = useState<string>('Sidebar Widgets');
  const [widgetTypeCount, setWidgetTypeCount] = useState<{
    sidebar: number;
    topbar: number;
  }>({
    sidebar: 0,
    topbar: 0,
  });

  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({
    mode: '',
    widgetID: '',
  });

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'noticeboard'}});
  }, []);

  //  TOP Function to load widgets
  const listNoticeboardWidgets = async () => {
    setLoading(true);
    try {
      const noticeboardWidgetsFetch: any = await API.graphql(
        graphqlOperation(queries.listNoticeboardWidgets, {
          filter: {roomID: {eq: activeRoom}},
        })
      );
      const response = await noticeboardWidgetsFetch;
      const arrayOfResponseObjects = response?.data?.listNoticeboardWidgets?.items;
      setWidgetData(arrayOfResponseObjects);

      // dispatch to context to show widsgets in noticeboard-admin
      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          property: 'widgets',
          data: arrayOfResponseObjects,
        },
      });
    } catch (e) {
      console.error('listNoticeboardWidgetsFetch: -> ', e);
    } finally {
      setLoading(false);
    }
  };

  const countWidgetTypes = (widgetArray: any[]) => {
    if (widgetArray) {
      console.log('widgetArray - ', widgetArray);
      return widgetArray.reduce(
        (acc: {sidebar: number; topbar: number}, widgetObj: any) => {
          if (widgetObj.placement === 'sidebar') {
            return {...acc, sidebar: acc.sidebar + 1};
          } else if (widgetObj.placement === 'topbar') {
            return {...acc, topbar: acc.topbar + 1};
          } else {
            return acc;
          }
        },
        {sidebar: 0, topbar: 0}
      );
    } else {
      return {
        sidebar: 0,
        topbar: 0,
      };
    }
  };

  useEffect(() => {
    if (widgetData.length > 0) {
      setWidgetTypeCount(countWidgetTypes(widgetData));
    }
  }, [widgetData]);

  useEffect(() => {
    setViewEditMode({mode: '', widgetID: ''});
    setNewWidgetData(initialNewWidgetData);

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
    const {id, value} = target;
    const basekey = e.target.getAttribute('data-basekey');
    const nestkey1 = e.target.getAttribute('data-nestkey1');
    const nestkey2 = e.target.getAttribute('data-nestkey2');

    switch (viewEditMode.mode) {
      case 'edit':
      case 'create': // final step to saving author!
        const updatedNewWidgetData = {
          ...newWidgetData,
          [basekey]: newWidgetData[basekey].map((nestedObj: any, idx: number) => {
            if (idx === parseInt(nestkey2)) {
              return {...nestedObj, [nestkey1]: value};
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
    const {id, value} = target;
    const dataVal = e.target.getAttribute('data-value');
    const basekey = e.target.getAttribute('data-basekey');
    const nestkey1 = e.target.getAttribute('data-nestkey1');
    const nestkey2 = e.target.getAttribute('data-nestkey2');

    const usableValue = typeof value !== 'undefined' ? value : dataVal;

    switch (viewEditMode.mode) {
      case 'edit':
        if (basekey && nestkey1) {
          setNewWidgetData({...newWidgetData, [basekey]: {[nestkey1]: usableValue}});
        } else {
          setNewWidgetData({...newWidgetData, [basekey]: usableValue});
        }
        break;
      case 'create':
        const updatedNewWidgetData = {...newWidgetData, [basekey]: usableValue};
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
  const handleEditUpdateWYSIWYG = (
    id: string,
    value: string,
    basekey: string,
    nestkey1: string,
    nestkey2: string
  ) => {
    switch (viewEditMode.mode) {
      case 'create':
      case 'edit':
        if (basekey !== '' && basekey !== undefined) {
          if (nestkey1 !== '' && nestkey1 !== undefined) {
            if (nestkey2 !== '' && nestkey2 !== undefined) {
              const updatedNewWidgetData = {
                ...newWidgetData,
                [basekey]: {
                  // @ts-ignore
                  ...newWidgetData[basekey],
                  // @ts-ignore
                  [nestkey1]: {...newWidgetData[basekey][nestkey1], [nestkey2]: value},
                },
              };
              setNewWidgetData(updatedNewWidgetData);
            } else {
              // @ts-ignore
              const updatedNewWidgetData = {
                ...newWidgetData,
                // @ts-ignore
                [basekey]: {...newWidgetData[basekey], [nestkey1]: value},
              };
              setNewWidgetData(updatedNewWidgetData);
            }
          } else {
            const updatedNewWidgetData = {...newWidgetData, [basekey]: value};
            setNewWidgetData(updatedNewWidgetData);
          }
        } else {
          console.error(
            'create err0r -> ',
            ' no basekey provided for update function...'
          );
        }
        break;
      default:
        console.log('handleWYSIWYGudpate ->', 'does not work');
    }
  };

  const handleEditToggle = (editMode: ViewEditMode['mode'], widgetID: string) => {
    setViewEditMode({mode: editMode, widgetID: widgetID});
  };

  const handleActivation = (id: string) => {
    const updatedWidgetData = {...newWidgetData, active: !newWidgetData.active};
    setNewWidgetData(updatedWidgetData);
  };

  // Function group to handle section-switching
  const handleTabClick = (e: React.MouseEvent) => {
    const {id} = e.target as HTMLElement;

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

  const filterWidgetContentBySubsection = widgetData.filter(
    (widgetObj: NoticeboardWidgetMapItem) => {
      if (widgetObj.placement === subSectionKey[subSection]) return widgetObj;
    }
  );

  // TODO: move this function to utils and improve functionality
  const appendHttp = (inputUrl: string) => {
    const splitUrl = inputUrl.split('://');
    if (splitUrl.length > 1) {
      return `https://${splitUrl[1]}`;
    } else if (splitUrl.length === 1) {
      return `https://${splitUrl[0]}`;
    } else {
      return `https://`;
    }
  };

  const linkArrayMap = (inputArray: any[]) => {
    return inputArray.map((elem: any) => {
      return {...elem, url: appendHttp(elem.url)};
    });
  };

  const noticeboardUpdate = async () => {
    const input = {
      id: newWidgetData.id,
      active: newWidgetData.active,
      placement: newWidgetData.placement,
      quotes: newWidgetData.quotes,
      links:
        newWidgetData.type !== 'file' && newWidgetData.type !== 'call'
          ? newWidgetData.links
          : linkArrayMap(newWidgetData.links),
      content: newWidgetData.content,
      description: newWidgetData.description,
      title: newWidgetData.title,
      type: newWidgetData.type,
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
      setViewEditMode({mode: '', widgetID: ''});
    }
  };

  const noticeboardCreate = async () => {
    const input = {
      ...newWidgetData,
      links:
        newWidgetData.type !== 'file' && newWidgetData.type !== 'call'
          ? newWidgetData.links
          : linkArrayMap(newWidgetData.links),
      teacherAuthID: state.user.authId,
      teacherEmail: state.user.email,
      roomID: activeRoom,
    };
    try {
      const noticeboardWidgetCreate: any = await API.graphql(
        graphqlOperation(mutations.createNoticeboardWidget, {
          input: input,
        })
      );
    } catch (e) {
      console.error('noticeboardWidgetCreate: widget: ', e);
    } finally {
      setViewEditMode({mode: '', widgetID: ''});
    }
  };

  const noticeboardDelete = async () => {
    const getWidgetObj = widgetData.find(
      (widgetObj: any) => widgetObj.id === viewEditMode.widgetID
    );
    const input = {
      id: getWidgetObj.id,
    };

    try {
      const noticeboardWidgetDelete: any = await API.graphql(
        graphqlOperation(mutations.deleteNoticeboardWidget, {
          input: input,
        })
      );
    } catch (e) {
      console.error('error deleting widget, -> ', e);
    } finally {
      setViewEditMode({mode: '', widgetID: ''});
    }
  };

  // UseEffect for monitoring save/create new changes and calling functions
  useEffect(() => {
    const manageSaveAndCreate = async () => {
      if (viewEditMode.mode === 'save') {
        await noticeboardUpdate();
        await listNoticeboardWidgets();
      }
      if (viewEditMode.mode === 'savenew') {
        await noticeboardCreate();
        await listNoticeboardWidgets();
      }
      if (viewEditMode.mode === 'delete') {
        await noticeboardDelete();
        await listNoticeboardWidgets();
      }
    };
    manageSaveAndCreate();
  }, [viewEditMode]);

  return (
    <>
      <TopWidgetBar />
      <ContentCard additionalClass={`flex-col`}>
        <SectionTitle
          title={`1. ${noticeboardDict[userLanguage].SECTION_TITLE.ROOM_SELECTOR}`}
        />

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

        <SectionTitle
          title={`2. ${noticeboardDict[userLanguage].SECTION_TITLE.WIDGET_MANAGER}`}
        />

        {/*
        Tabs to select between:
          - Top widgets
          - Sidebar widgets
      */}
        <SubSectionTabs
          subSection={subSection}
          subSectionList={['Top Widgets', 'Sidebar Widgets']}
          handleTabClick={handleTabClick}
          widgetTypeCount={widgetTypeCount}
        />

        <NoticeboardAdminContent
          activeRoom={activeRoom}
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
          initialNewWidgetData={initialNewWidgetData}
          newWidgetData={newWidgetData}
          setNewWidgetData={setNewWidgetData}
          content={widgetData.length > 0 && filterWidgetContentBySubsection}
        />
      </ContentCard>
    </>
  );
};

export default NoticeboardAdmin;

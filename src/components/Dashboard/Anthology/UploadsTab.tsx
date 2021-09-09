import React, {useCallback, useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {FaImages} from 'react-icons/fa';
import {getImagesFromS3Folder, getImageFromS3Static} from '../../../utilities/services';
import Loader from '../../Atoms/Loader';
import Auth from '@aws-amplify/auth';
import {API, graphqlOperation} from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';

const LIMIT = 100;

const UploadsTab = ({userAuthId, sectionRoomID}: any) => {
  // ##################################################################### //
  // ############################ CRUD UPLOADS ########################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  const [allPersonLessonFiles, setAllPersonLessonFiles] = useState<any[]>([]);
  const [personLessonFilesLoaded, setPersonLessonFilesLoaded] = useState<boolean>(false);

  // const listPersonLessonFiles = useCallback(async () => {
  //   try {
  //     const listFilter = {
  //       filter: {
  //         studentAuthID: {eq: userAuthId},
  //         roomID: {eq: sectionRoomID},
  //       },
  //     };

  //     const personLessonFiles: any = await API.graphql(
  //       graphqlOperation(queries.listPersonFiles, listFilter)
  //     );
  //     const personLessonFilesRows =
  //       personLessonFiles.data.listUniversalJournalDatas.items;

  //     if (personLessonFilesRows?.length > 0) {
  //       console.log('anthology - personLessonFiles exist ', personLessonFilesRows);

  //       setAllPersonLessonFiles(personLessonFilesRows);
  //     } else {
  //       console.log('anthology - NO universalJournalDatas');
  //     }
  //     setPersonLessonFilesLoaded(true);
  //   } catch (e) {
  //     console.error('error listing journal data - ', e);
  //     setPersonLessonFilesLoaded(true);
  //   } finally {
  //   }
  // }, [userAuthId, sectionRoomID]);

  // useEffect(() => {
  //   // do this on mount
  //   if (userAuthId && sectionRoomID) {
  //     listPersonLessonFiles();
  //   }
  // }, [userAuthId, sectionRoomID]);

  // ##################################################################### //
  // ############################# GET IMAGES ############################ //
  // ##################################################################### //

  // const [loading, setLoading] = useState<boolean>(true);
  // const [images, setImages] = useState<any>([]);
  // const [hasMore, setHasMore] = useState<boolean>(false);
  // useEffect(() => {
  //   if (user && user?.id) {
  //     fetchImagesFromS3();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (images) {
  //     console.log('images', images);
  //   }
  // }, [images]);

  // const BASE_PATH = `ULB/studentdata/${user.id}`;

  // const fetchImagesFromS3 = async (startAfter: string = '') => {
  //   const response: any = await getImagesFromS3Folder(BASE_PATH, startAfter, LIMIT);
  //   setImages((prevImages: any) => [...prevImages, ...response.Contents]);
  //   setHasMore(response.IsTruncated);
  //   setLoading(false);
  // };

  return <h1>Hello</h1>;
};

export default UploadsTab;

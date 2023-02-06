import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {general} from 'assets';
import React from 'react';
import {useHistory} from 'react-router';

const QuickTiles = ({
  user,
  updateAuthState
}: {
  user: any;
  updateAuthState: () => void;
}) => {
  const {Institute_info, CommunityDict} = useDictionary();

  const {checkIfAdmin} = useGlobalContext();

  const TABS = Institute_info[user?.userLanguage || 'EN']['TABS'];
  const TABS2 = CommunityDict[user?.userLanguage || 'EN']['TABS'];

  const baseUrl =
    user?.role === 'SUP'
      ? `/dashboard/manage-institutions`
      : user?.associateInstitute?.length
      ? `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}`
      : '';

  const menuForNonStudents = [
    {
      id: 0,
      title: TABS['USER_REGISTRY'],
      url: `${baseUrl}/manage-users`,
      imageUrl: general.quickTiles.userRegistery
    },
    {
      id: 1,
      title: TABS['STAFF'],
      url: `${baseUrl}/staff`,
      imageUrl: general.quickTiles.staffManager
    },
    {
      id: 2,
      title: TABS['COURSES'],
      url: `${baseUrl}/courses`,
      imageUrl: general.quickTiles.courseManager
    },
    {
      id: 3,
      title: TABS['CLASSROOMS'],
      url: `${baseUrl}/class-rooms`,
      imageUrl: general.quickTiles.classroomManager
    },
    {
      id: 4,
      title: TABS2['COMMUNITY_BUILDER'],
      url: `/dashboard/community/builder`,
      imageUrl: general.quickTiles.communityBuilder
    },
    {
      id: 5,
      title: TABS['RESEARCH_AND_ANALYTICS'],
      url: `${baseUrl}/research-and-analytics`,
      imageUrl: general.quickTiles.analyticsManager
    },
    checkIfAdmin() && {
      id: 6,
      title: TABS['ERRORS'],
      url: `/dashboard/errors`,
      imageUrl: general.quickTiles.errors
    },
    checkIfAdmin() && {
      id: 6,
      title: TABS['UPLOAD_LOGS'],
      url: `/dashboard/upload-logs`,
      imageUrl: general.quickTiles.uploadLogs
    }
  ].filter(Boolean);
  const menuForStudents = [
    {
      id: 0,
      title: TABS['HOME'],
      url: `${baseUrl}/dashboard/home`,
      imageUrl: general.quickTiles.analyticsManager
    },
    {
      id: 1,
      title: TABS['GAME_CHANGERS'],
      url: `${baseUrl}/dashboard/game-changers`,
      imageUrl: general.quickTiles.gameChangers
    },
    {
      id: 2,
      title: TABS['COMMUNITY'],
      url: `${baseUrl}/dashboard/community/front`,
      imageUrl: general.quickTiles.communityBuilder
    },
    {
      id: 3,
      title: TABS['NOTEBOOK'],
      url: `${baseUrl}/dashboard/anthology`,
      imageUrl: general.quickTiles.anthology
    }
  ];

  const history = useHistory();

  const goTo = (url: string) => {
    updateAuthState();
    history.push(url);
  };

  const menu = user.role === 'ST' ? menuForStudents : menuForNonStudents;

  return (
    <div
      className={`grid quick-tiles  ${
        menu.length > 6 ? 'grid-cols-3' : 'grid-cols-2'
      } gap-6 transition-all min-h-72`}>
      {menu.map((item) => (
        <div
          onClick={() => goTo(item.url)}
          className="h-32 relative quick-tiles-item cursor-pointer transition-all hover:theme-bg font-medium theme-border overflow-hidden rounded-xl flex items-center justify-center text-center hover:theme-card-shadow"
          key={item.id}>
          <h1 className="z-100 text-white theme-bg py-1 absolute bottom-0">
            {item.title}
          </h1>
          <img
            src={item.imageUrl}
            className="absolute object-cover hover:scale-110 overflow-hidden transform transition-all duration-300 rounded-xl h-full inset-0 w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default QuickTiles;

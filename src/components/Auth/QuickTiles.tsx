import useDictionary from '@customHooks/dictionary';
import React from 'react';
import {useHistory} from 'react-router';

const QuickTiles = ({user}: {user: any}) => {
  const {Institute_info, CommunityDict} = useDictionary();

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
      url: `${baseUrl}/manage-users`
    },
    {
      id: 1,
      title: TABS['STAFF'],
      url: `${baseUrl}/staff`
    },
    {
      id: 2,
      title: TABS['COURSES'],
      url: `${baseUrl}/courses`
    },
    {
      id: 3,
      title: TABS['CLASSROOMS'],
      url: `${baseUrl}/class-rooms`
    },
    {
      id: 4,
      title: TABS2['COMMUNITY_BUILDER'],
      url: `/dashboard/community/builder`
    },
    {
      id: 5,
      title: TABS['RESEARCH_AND_ANALYTICS'],
      url: `${baseUrl}/research-and-analytics`
    }
  ];
  const menuForStudents = [];

  const history = useHistory();

  const goTo = (url: string) => history.push(url);

  return (
    <div className="grid quick-tiles grid-cols-2 gap-6 transition-all min-h-72">
      {menuForNonStudents.map((item) => (
        <div
          onClick={() => goTo(item.url)}
          className="border-0 quick-tiles-item cursor-pointer transition-all hover:theme-bg hover:text-white font-medium theme-border rounded-xl flex items-center justify-center text-center hover:theme-card-shadow"
          key={item.id}>
          {item.title}
        </div>
      ))}
    </div>
  );
};

export default QuickTiles;

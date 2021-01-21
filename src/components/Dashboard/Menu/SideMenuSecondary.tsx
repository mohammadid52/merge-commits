import React, { useContext, useEffect, useState } from 'react';
import { SideMenuProps } from '../Dashboard';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';

const SideMenuSecondary = (props: SideMenuProps) => {
  const { isTeacher, currentPage, setCurrentPage } = props;
  const { state, theme, dispatch } = useContext(GlobalContext);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('');

  useEffect(() => {
    const listClassStudents = async () => {
      const fullAuthID = state.user?.authId ? state.user.authId : null;
      // const standardUserID = state.user?.id ? state.user.id : null;
      const standardUserID = "19944846-faa9-4f94-a2b1-434902d4aa49";
      const userEmail = state.user?.email ? state.user.email : null;

      try {
        const classesFetch = await API.graphql(
          graphqlOperation(customQueries.listClassStudents, { studentID: standardUserID })
        );
        const response = await classesFetch;
        console.log('Classes Fetch: ', classesFetch);
        return response;
      } catch (e) {
        console.error('Classes Fetch ERR: ', e);
      } finally {
        console.log('Classes Fetch: ', 'Cleaned up...');
      }
    };
    listClassStudents();
  }, []);

  return (
    <div className={theme.sidemenu.secondary}>
      <div className={`p-2 bg-white border border-dark-gray border-opacity-10`}>Item</div>
      <div className={`p-2 bg-white border border-dark-gray border-opacity-10`}>Item</div>
      <div className={`p-2 bg-white border border-dark-gray border-opacity-10`}>Item</div>
      <div className={`p-2 bg-white border border-dark-gray border-opacity-10`}>Item</div>
      <div className={`p-2 bg-white border border-dark-gray border-opacity-10`}>Item</div>
    </div>
  );
};

export default SideMenuSecondary;

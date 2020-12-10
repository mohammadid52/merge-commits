import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import API, { graphqlOperation } from '@aws-amplify/api';
import { FaEdit } from 'react-icons/fa';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import * as queries from '../../../../graphql/queries';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import UserInformation from './UserInformation';
import UserEdit from './UserEdit';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import Buttons from '../../../Atoms/Buttons';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import { getImageFromS3 } from '../../../../utilities/services';

export interface UserInfo {
  authId: string
  courses?: string
  createdAt: string
  email: string
  externalId?: string
  firstName: string
  grade?: string
  id: string
  image?: string
  institution?: string
  language: string
  lastName: string
  preferredName?: string
  role: string
  status: string
  phone: string
  updatedAt: string
  birthdate?: string
}


const User = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const { theme } = useContext(GlobalContext);
  const [status, setStatus] = useState('');
  const [user, setUser] = useState<UserInfo>(
    {
      id: '',
      authId: '',
      courses: null,
      createdAt: '',
      email: '',
      externalId: null,
      firstName: '',
      grade: null,
      image: null,
      institution: null,
      language: '',
      lastName: '',
      preferredName: null,
      role: '',
      status: '',
      phone: '',
      updatedAt: '',
      birthdate: null,
    }
  );
  const [imageUrl, setImageUrl] = useState('')
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, "");
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const queryParams = queryString.parse(location.search)
  const breadCrumsList = [
    { title: 'Home', url: '/', last: false },
    { title: 'People', url: '/dashboard/manage-users', last: false },
    { title: 'User Information', url: `${location.pathname}${location.search}`, last: true }
  ]

  async function getUserById(id: string) {
    try {
      const result: any = await API.graphql(graphqlOperation(queries.userById, { id: id }))
      const userData = result.data.userById.items.pop();
      setStatus('done');
      setUser(() => {
        if (typeof userData === 'object') {
          return userData
        }
        return user
      });

    } catch (error) {
      console.error(error);
    }
  }

  // TODO: Make below functions global(initials, stringToHslColor)

  const initials = (firstName: string, lastName: string) => {
    let firstInitial = firstName.charAt(0).toUpperCase()
    let lastInitial = lastName.charAt(0).toUpperCase()
    return firstInitial + lastInitial;
  }

  const stringToHslColor = (str: string) => {
    let hash = 0;
    let i;
    for (i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let h = hash % 360;
    return 'hsl(' + h + ', 70%, 72%)';
  }

  useEffect(() => {
    let id = queryParams.id;
    if (typeof id === 'string') {
      getUserById(id);

    }
  }, [])

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(user.image);
      setImageUrl(imageUrl);
    }
    getUrl();

  }, [user.image])

  if (status !== 'done') {
    return (<LessonLoading />)
  }
  {
    return (
      <div className={`w-9/10 h-full mt-4`}>
        <BreadCrums items={breadCrumsList} />
        <div className="flex justify-between">
          <SectionTitle title="USER INFORMATION" />

          <div className="flex justify-end py-4 mb-4 w-5/10">
            <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
            {currentPath !== 'edit' ? (
              <Buttons btnClass="mr-4" onClick={() => history.push(`${match.url}/edit`)} Icon={FaEdit} />
            ) : null
            }
          </div>
        </div>
        <div className={`w-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
          <div className="h-9/10 flex flex-col md:flex-row">
            <div className="w-auto p-4 flex flex-col text-center items-center">
              {
                user.image ? (
                  <img
                    src={imageUrl}
                    className="w-20 h-20 md:w-40 md:h-40 rounded-full" />) :
                  <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
                    <div className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full" style={{ background: `${stringToHslColor(user.firstName + ' ' + user.lastName)}`, textShadow: '0.2rem 0.2rem 3px #423939b3' }}>
                      {initials(user.preferredName ? user.preferredName : user.firstName, user.lastName)}
                    </div>
                  </div>
              }
              <div className={`text-lg md:text-3xl font-bold font-open text-gray-900 mt-4`}>
                {`${user.preferredName ? user.preferredName : user.firstName} ${user.lastName}`}
                <p className="text-md md:text-lg">
                  {`${user.institution ? user.institution : ''}`}
                </p>
              </div>
            </div>
            <Switch>
              <Route
                path={`${match.url}/edit`}
                render={() => (
                  <UserEdit
                    user={user}
                    status={status}
                    setStatus={setStatus}
                    getUserById={getUserById}
                  />
                )}
              />
              <Route
                path={`${match.url}/`}
                render={() => (
                  <UserInformation
                    user={user}
                    status={status}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export default User;
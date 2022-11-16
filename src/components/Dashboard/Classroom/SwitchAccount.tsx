import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import {Auth} from 'aws-amplify';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';
import React from 'react';
import {useCookies} from 'react-cookie';
import {useHistory} from 'react-router';

const accounts = [
  {
    email: 'demoteacher@zoiq.io',
    password: 'admin123'
  },
  {
    email: 'demostudent2@zoiq.io',
    password: 'admin123'
  },
  {
    email: 'michael.russell@zoiq.io',
    password: 'admin123'
  },

  {
    email: 'demo_student+self_paced@zoiq.io',
    password: 'admin123'
  }
];

const SwitchAccount = () => {
  const {email} = useAuth();

  const [cookies, setCookie, removeCookie] = useCookies();

  const {dispatch, state} = useGlobalContext();

  async function SignIn(_email: string, _password: string) {
    try {
      const user = await Auth.signIn(_email, _password);
      dispatch({type: 'LOG_IN', payload: {email: _email, authId: user.username}});
      const auth = cookies.cred;

      if (auth?.isChecked) {
        setCookie(
          'cred',
          {email: _email, isChecked: auth?.isChecked, _password},
          {path: '/'}
        );
      } else {
        removeCookie('cred');
      }
      setCookie(
        'auth',
        {email: _email, authId: user.username},
        {secure: false, path: '/'}
      );
      sessionStorage.setItem('accessToken', user.signInUserSession.accessToken.jwtToken);
      if (user) {
        let userInfo: any = await API.graphql(
          graphqlOperation(queries.getPerson, {email: _email, authId: user.username})
        );
        userInfo = userInfo.data.getPerson;
        let instInfo: any = {};
        if (userInfo.role !== 'ST') {
          instInfo = await API.graphql(
            graphqlOperation(customQueries.getAssignedInstitutionToStaff, {
              filter: {staffAuthID: {eq: user.username}}
            })
          );
        }

        dispatch({
          type: 'SET_USER',
          payload: {
            id: userInfo.id,
            firstName: userInfo.preferredName || userInfo.firstName,
            lastName: userInfo.lastName,
            language: userInfo.language,
            onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
            role: userInfo.role,
            image: userInfo.image,
            associateInstitute:
              instInfo?.data?.listStaff?.items.filter((item: any) => item.institution) ||
              [],
            onDemand: userInfo?.onDemand,
            lessons: userInfo.lessons,
            lastEmotionSubmission: userInfo?.lastEmotionSubmission
          }
        });
        const input = {
          id: userInfo.id,
          authId: user.username,
          email: _email,
          lastLoggedIn: new Date().toISOString()
        };
        const update: any = await API.graphql(
          graphqlOperation(customMutations.updatePersonLoginTime, {input})
        );
      }
    } catch (error) {}
  }

  async function SignOut() {
    try {
      const input = {
        id: state.user.id,
        authId: state.user.authId,
        email: state.user.email,
        lastLoggedOut: new Date().toISOString()
      };
      API.graphql(graphqlOperation(customMutations.updatePersonLogoutTime, {input}));
      await Auth.signOut();

      //   removeCookie('auth', {path: '/'});
      //   sessionStorage.removeItem('accessToken');
      //   removeLocalStorageData('active_step_section');
      //   removeLocalStorageData('selected_institution');
      //   dispatch({type: 'CLEANUP'});
    } catch (error) {
      console.error('error signing out: ', error);
    }
  }

  const history = useHistory();
  const onClick = (_email: string, password: string) => {
    if (email === _email) {
      return;
    } else {
      SignOut();
      setTimeout(() => {
        SignIn(_email, password);
        history.push('/dashboard');
      }, 2000);
    }
  };

  return (
    <ul className="fixed border-0 border-gray-300 w-auto bg-white rounded-xl customShadow bottom-5 left-2">
      {accounts.map((account, idx) => {
        const current = email === account.email;
        return (
          <li
            key={account.email}
            onClick={() => onClick(account.email, account.password)}
            className={`px-4 py-2 cursor-pointer ${
              current ? '' : ' hover:text-indigo-500'
            } ${
              idx === 0
                ? 'rounded-t-xl'
                : idx === accounts.length - 1
                ? 'rounded-b-xl'
                : ''
            } ${current ? 'bg-indigo-500 text-white' : ''}`}>
            {account.email}
          </li>
        );
      })}
    </ul>
  );
};

export default SwitchAccount;

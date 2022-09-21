import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import BreadcrumbsWithBanner from '@components/Atoms/BreadcrumbsWithBanner';
import React, {useContext, useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import {getAsset} from '../../../assets';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import Buttons from '../../Atoms/Buttons';
import SectionTitle from '../../Atoms/SectionTitle';
import TestCasesInfo from './TestCasesInfo';
import {createCypressTesting} from '@graphql/mutations';
import {listCypressTestings} from '@graphql/queries';
import TestCasesAdd from './TestCasesAdd';

const TestCases = () => {
  const {theme, userLanguage, clientKey} = useContext(GlobalContext);
  const {dashboardTestCasesDict, BreadcrumsTitles} = useDictionary(clientKey);
  const match = useRouteMatch();
  const history = useHistory();
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const [status, setStatus] = useState('');

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['TEST_CASES'],
      url: '/dashboard/test-cases',
      last: true
    }
  ];

  // TEST CASES QUERY

  async function getTestCases() {
    try {
      const results: any = await API.graphql(
        graphqlOperation(listCypressTestings, {filter: {}})
      );
      console.log({results});
      //   const userData: any = results.data.getPerson;
      //   setPerson(personalInfo);
      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  }
  async function createSampleTestCase() {
    try {
      // @zuhair - change inputs here
      const input = {
        testID: '1234',
        testName: 'test1234',
        testData: 'test1234data',
        testExpResults: 'test',
        testSteps: '1234',
        testType: 'testType'
      };

      const results: any = await API.graphql(
        graphqlOperation(createCypressTesting, {input: input})
      );
      console.log({results});

      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getTestCases();
  }, []);

  const testCasesBanner1 = getAsset(clientKey, 'dashboardBanner1');

  // if (status !== 'done') {
  //   return <LessonLoading />;
  // }
  {
    return (
      <div className="relative">
        <BreadcrumbsWithBanner
          items={breadCrumsList}
          bannerImage={testCasesBanner1}
          title={'Test Cases'}
        />

        <div className={`main_container p-0 mx-auto w-10/12 px-5`}>
          <div className="flex justify-between flex-col md:flex-row mt-5">
            <SectionTitle
              title={
                currentPath === 'add'
                  ? 'Add Test Case'
                  : dashboardTestCasesDict[userLanguage]['TITLE']
              }
              subtitle={dashboardTestCasesDict[userLanguage]['SUBTITLE']}
            />

            {currentPath !== 'add' ? (
              <div className="flex justify-end py-2 2xl:py-4 mb-2 2xl:mb-4 w-full md:w-3/5 lg:w-5/10">
                <Buttons
                  btnClass="ml-6"
                  label="Add"
                  onClick={() => history.push(`${match.url}/add`)}
                  Icon={FaPlus}
                />{' '}
              </div>
            ) : null}
          </div>
          <div
            className={`w-full m-auto p-2 md:p-4 white_back mb-2 md:mb-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
            <div className="relative w-full">
              <Switch>
                <Route
                  exact
                  path={`${match.url}/`}
                  render={() => <TestCasesInfo status={status} />}
                />
                <Route
                  path={`${match.url}/add`}
                  render={() => <TestCasesAdd status={status} setStatus={setStatus} />}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TestCases;

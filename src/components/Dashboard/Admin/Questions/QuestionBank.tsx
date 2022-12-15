import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom';

import QuestionsList from './QuestionsList';
import QuestionAdd from './QuestionAdd';
import QuestionEdit from './QuestionEdit';
import ErrorBoundary from '@components/Error/ErrorBoundary';

interface QuestionBankProps {}

const QuestionBank = (props: QuestionBankProps) => {
  const {} = props;
  const match = useRouteMatch();

  return (
    <div className={`w-full h-full p-8 flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => (
            <ErrorBoundary componentName="QuestionsList">
              <QuestionsList />
            </ErrorBoundary>
          )} // Questions list
        />
        <Route
          exact
          path={`${match.url}/question/add`}
          render={() => (
            <ErrorBoundary componentName="QuestionAdd">
              <QuestionAdd />
            </ErrorBoundary>
          )} // Question add
        />
        <Route
          exact
          path={`${match.url}/question/edit`}
          render={() => (
            <ErrorBoundary componentName="QuestionEdit">
              <QuestionEdit />
            </ErrorBoundary>
          )} // Question edit
        />
      </Switch>
    </div>
  );
};

export default QuestionBank;

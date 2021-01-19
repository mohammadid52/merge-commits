import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import QuestionsList from './QuestionsList';

interface QuestionBankProps {

}

const QuestionBank = (props: QuestionBankProps) => {
  const { } = props;
  const match = useRouteMatch();

  return (
    <div className={`w-full h-full p-8 flex justify-center`}>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          render={() => <QuestionsList />}    // Questions list
        />
        {/* <Route
          exact
          path={`${match.url}/question/add`}
          render={() => <QuestionsList />}    // Questions list
        /> */}
      </Switch>
    </div>
  )
}

export default QuestionBank;

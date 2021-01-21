import React from 'react'
import Buttons from '../../../Atoms/Buttons'
import { useHistory, useRouteMatch } from 'react-router-dom'

const Lessons = () => {
  const match = useRouteMatch();
  const history = useHistory()
  const buildLesson = () => {
    history.push(`${match.url}/add`);

  }
  return (
    <div className="">
      <Buttons label="Add New Lesson" onClick={buildLesson} btnClass="" />
    </div>
  )
}

export default Lessons

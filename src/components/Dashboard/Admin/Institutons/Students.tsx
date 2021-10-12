import React, {useContext, useEffect, useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as customQueries from '../../../../customGraphql/customQueries';

import StudentsTiles from '@components/Dashboard/Home/StudentsTiles';
import {GlobalContext} from '@contexts/GlobalContext';

const Students = (props: any) => {
  const {state} = useContext(GlobalContext);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentList();
  }, []);

  const fetchStudentList = async () => {
    const response: any = await API.graphql(
      graphqlOperation(customQueries.getDashboardDataForTeachers, {
        filter: {teacherAuthID: {eq: state.user.authId}},
      })
    );
    const data = response?.data?.listRooms?.items;

    let list: any[] = [];
    let uniqIds: string[] = [];
    if (data?.length) {
      data[0]?.class?.students?.items.forEach((student: any) => {
        if (!uniqIds.includes(student.student.id)) {
          list.push(student);
          uniqIds.push(student.student.id);
        }
      });
    }
    setLoading(false);
    setStudentsList(list);
  };

  return (
    <div className="my-6">
      <StudentsTiles
        isTeacher
        title={`Your Students`}
        state={state}
        studentsList={studentsList}
        loading={loading}
      />
    </div>
  );
};

export default Students;

import React, { useContext, useEffect, useState } from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as customQueries from '../../../../customGraphql/customQueries';

import StudentsTiles from '@components/Dashboard/Home/StudentsTiles';
import { GlobalContext } from '@contexts/GlobalContext';

const Students = (props: any) => {
    const {state} = useContext(GlobalContext);
    const [studentsList, setStudentsList] = useState([])

    useEffect(() => {
        fetchStudentList()
    },[])

    const fetchStudentList = async() => {
        console.log("inside fetchStudentList");
        
        const response: any = await API.graphql(
            graphqlOperation(customQueries.getDashboardDataForTeachers, {
              filter: {teacherAuthID: {eq: state.user.authId}},
            })
          );
          console.log(response,'responseresponse');
          const data = response?.data?.listRooms?.items;
          
        const getStudentsList = () => {
            let list: any[] = [];
            let uniqIds: string[] = [];
            data?.length &&
            data?.class?.rooms?.items.forEach((item: any) => {
                item?.class?.students?.items.forEach((student: any) => {
                  if (!uniqIds.includes(student.student.id)) {
                    list.push(student);
                    uniqIds.push(student.student.id);
                  }
                });
              });
        
            return list;
          };
    }

    return <div className="my-6">
    <StudentsTiles
      isTeacher
      title={`Your Students`}
      state={state}
      studentsList={[]}
    />
  </div>
}

export default Students
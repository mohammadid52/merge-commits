import React, {Fragment, useEffect, useState} from 'react';
import {graphqlOperation, API} from 'aws-amplify';
import * as customQueries from 'customGraphql/customQueries';
import {getUniqItems} from 'utilities/strings';

import {sortBy} from 'lodash';
import Loader from 'atoms/Loader';

interface IProfileFrameDemographicsProps {
  studentID?: any;
  currentTab?: string;
}

const ProfileFrameDemographics = ({
  studentID,
  currentTab
}: IProfileFrameDemographicsProps) => {
  const [loading, setLoading] = useState(false);

  // ##################################################################### //
  // ################################ USER ############################### //
  // ##################################################################### //

  const [profileUser, setProfileUser] = useState<any>();

  async function getUserProfile(id: string) {
    setLoading(true);
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUserProfile, {id: id})
      );
      const userData = result.data.userById.items.pop();

      let studentClasses: any = userData.classes?.items.map((item: any) => item?.class);
      studentClasses = studentClasses.filter((d: any) => d !== null);

      const studentRooms: any = studentClasses?.reduce((roomAcc: any[], item: any) => {
        if (item?.room) {
          return [...roomAcc, item.room];
        } else {
          return roomAcc;
        }
      }, []);

      userData.rooms = studentRooms;

      const studentCurriculars: any =
        studentRooms.length > 0
          ? studentRooms.map((item: any) => item?.curricula?.items).flat(1)
          : [];

      // console.log('studentCurriculars', studentCurriculars);

      const uniqCurriculars: any =
        studentCurriculars.length > 0
          ? getUniqItems(
              studentCurriculars.filter((d: any) => d !== null),
              'curriculumID'
            )
          : [];
      // console.log('uniqCurriculars', uniqCurriculars);

      const studCurriCheckp: any =
        uniqCurriculars.length > 0
          ? uniqCurriculars
              .map((item: any) => item?.curriculum?.checkpoints?.items)
              .flat(1)
          : [];

      // console.log('studCurriCheckp', studCurriCheckp);

      const studentCheckpoints: any =
        studCurriCheckp.length > 0
          ? studCurriCheckp.map((item: any) => item?.checkpoint)
          : [];

      // console.log('studentCheckpoints', studentCheckpoints);

      let sCheckpoints: any[] = [];

      studentCheckpoints.forEach((item: any) => {
        if (item) sCheckpoints.push(item);
      });

      sCheckpoints = sortBy(sCheckpoints, (item: any) => item.scope === 'private');

      /***********************
       *   DEMOGRAPHIC AND   *
       * PRIVATE CHECKPOINTS *
       ***********************/

      // ~~~~~~~~~~~~~~~~ UNIQUE ~~~~~~~~~~~~~~~ //
      const uniqCheckpoints: any = sCheckpoints ? getUniqItems(sCheckpoints, 'id') : [];
      const uniqCheckpointIDs: any = uniqCheckpoints.map((item: any) => item?.id);

      // ~~~~~~~~~~~~~~ SPLIT OUT ~~~~~~~~~~~~~~ //
      const demographicCheckpoints = uniqCheckpoints
        .filter((checkpoint: any) => checkpoint.scope !== 'private')
        .map((checkpoint: any) => {
          if (checkpoint?.questionSeq) {
            return {
              ...checkpoint,
              questions: {
                items: checkpoint.questionSeq.reduce((acc: any[], seqString: string) => {
                  let findQ = checkpoint.questions.items.find(
                    (item: any) => item.question.id === seqString
                  );
                  if (findQ) {
                    return [...acc, findQ];
                  } else {
                    return acc;
                  }
                }, [])
              }
            };
          } else {
            return checkpoint;
          }
        });
      const privateCheckpoints = uniqCheckpoints
        .filter((checkpoint: any) => checkpoint.scope === 'private')
        .map((checkpoint: any) => {
          if (checkpoint?.questionSeq) {
            return {
              ...checkpoint,
              questions: {
                items: checkpoint.questionSeq.reduce((acc: any[], seqString: string) => {
                  let findQ = checkpoint.questions.items.find(
                    (item: any) => item.question.id === seqString
                  );
                  if (findQ) {
                    return [...acc, findQ];
                  } else {
                    return acc;
                  }
                }, [])
              }
            };
          } else {
            return checkpoint;
          }
        });

      const personalInfo: any = {...userData};

      delete personalInfo.classes;

      setDemographicCheckpoints(demographicCheckpoints);
      setPrivateCheckpoints(privateCheckpoints);

      setProfileUser(() => {
        if (typeof userData === 'object') {
          return userData;
        }
        return profileUser;
      });

      if (uniqCheckpointIDs?.length > 0) {
        getQuestionData(uniqCheckpointIDs, userData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // ~~~~~~~~~~~~~ USER EFFECT ~~~~~~~~~~~~~ //

  useEffect(() => {
    if (studentID) {
      getUserProfile(studentID);
    }
  }, [studentID]);

  // ##################################################################### //
  // ########################## GET CHECKPOINTS ########################## //
  // ##################################################################### //

  const [questionData, setQuestionData] = useState<any[]>([]);
  const [demographicCheckpoints, setDemographicCheckpoints] = useState<any[]>([]);
  const [privateCheckpoints, setPrivateCheckpoints] = useState<any[]>([]);

  // ~~~~~~~~~~ GET QUESTION DATA ~~~~~~~~~~ //
  const getQuestionData = async (checkpointIDs: any[], user: any) => {
    const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
      return {
        checkpointID: {
          eq: item
        }
      };
    });
    const filter = {
      and: [
        {email: {eq: user.email}},
        {authID: {eq: user.authId}},
        {syllabusLessonID: {eq: '999999'}},
        {
          or: [...checkpointIDFilter]
        }
      ]
    };
    const results: any = await API.graphql(
      graphqlOperation(customQueries.listQuestionDatas, {filter: filter})
    );
    const questionData: any = results.data.listQuestionData?.items;
    setQuestionData(questionData);
  };

  // ~~~~~~~~~~~~ GET RESPONSES ~~~~~~~~~~~~ //
  const getQuestionResponse = (checkpointID: string, questionID: string) => {
    const selectedCheckp: any = questionData.find(
      (item: any) => item.checkpointID === checkpointID
    );

    if (selectedCheckp) {
      const questionResponce: any = selectedCheckp.responseObject?.find(
        (item: any) => item.qid === questionID
      )?.response;
      if (questionResponce) {
        const stringedResponse = questionResponce.toString();

        if (stringedResponse.includes('Other')) {
          const splitAnswer = stringedResponse.split(' || '); // this will return ["Other", "answer"]
          const answer = splitAnswer[1];
          if (answer) return answer;
          else return 'Other';
        } else {
          return questionResponce ? questionResponce.join(',') : '--';
        }
      }
    }
  };

  // ##################################################################### //
  // ########################## PICK CHECKPOINTS ######################### //
  // ##################################################################### //

  const checkpoints =
    currentTab === '1'
      ? demographicCheckpoints
      : currentTab === '2'
      ? privateCheckpoints
      : [];

  if (loading) {
    return <Loader />;
  } else if (!loading && checkpoints.length === 0) {
    return (
      <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
        <div className="px-4 py-5 border-b-0 border-lightest sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-darkest   uppercase">
            No checkpoints found
          </h3>
        </div>
      </div>
    );
  } else
    return (
      <Fragment>
        {checkpoints.map((checkpoint: any) => (
          <Fragment key={`checkpoint_${checkpoint.id}`}>
            <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
              <div className="px-4 py-5 border-b-0 border-lightest sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-darkest   uppercase">
                  {checkpoint.title}
                </h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  {checkpoint.questions?.items.map((item: any) => (
                    <div key={item.question.id} className="sm:col-span-1 p-2">
                      <dt className="text-sm leading-5 font-medium text-medium ">
                        {item.question.question}
                      </dt>
                      <dd className="mt-1 text-sm leading-5 text-darkest">
                        {item.question.type !== 'link' ? (
                          getQuestionResponse(checkpoint.id, item.question.id) || '--'
                        ) : (
                          <a
                            className="text-blue-400 hover:text-blue-600 transition-all"
                            href={getQuestionResponse(checkpoint.id, item.question.id)}>
                            {getQuestionResponse(checkpoint.id, item.question.id)}
                          </a>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Fragment>
        ))}
      </Fragment>
    );
};

export default ProfileFrameDemographics;

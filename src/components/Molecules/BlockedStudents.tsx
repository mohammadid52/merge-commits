import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Buttons from '@components/Atoms/Buttons';
import Popover from '@components/Atoms/Popover';
import {Person} from 'API';
import * as customMutations from 'customGraphql/customMutations';
import React, {useState} from 'react';

const BlockedStudent = ({person, unblock}: IBlockedStudent) => {
  return (
    <li className="flex justify-between items-center ">
      <span className="w-auto">
        {person.firstName} {person.lastName}
      </span>
      <Buttons
        size="small"
        transparent
        onClick={() => unblock(person.authId, person.email)}
        label={'Unblock'}
      />
    </li>
  );
};

interface IBlockedStudents {
  classList: any[];
  blockedStudents: string[];
  roomId: string;
}
interface IBlockedStudent {
  person: Person;
  unblock: (authId: string, email: string) => void;
}

const BlockedStudents = ({classList, blockedStudents = [], roomId}: IBlockedStudents) => {
  const [show, setShow] = useState(false);

  const unblock = async (authId: string, email: string) => {
    try {
      const removedFrom =
        classList.find((student) => student.authId === authId)?.removedFrom || [];
      const updatedRoomList = removedFrom.filter((id: string) => id !== authId);

      const updatedBlockedStudents = blockedStudents.filter(
        (id: string) => id !== authId
      );

      let mutationOne = API.graphql(
        graphqlOperation(customMutations.updateStudentFromRoom, {
          input: {
            id: roomId,
            blockedStudents: updatedBlockedStudents
          }
        })
      );
      let mutationTwo = API.graphql(
        graphqlOperation(customMutations.updatePerson, {
          input: {
            authId,
            email,
            removedFrom: updatedRoomList
          }
        })
      );

      Promise.resolve(Promise.all([mutationOne, mutationTwo]));

      console.log('unblocked student -> ', authId);
    } catch (error) {
      console.error('error unblocking student -> ', authId, ' -> ', error);
    } finally {
      setShow(false);
    }
  };

  const listWithNames: Person[] = blockedStudents.map((authId: string) => {
    const found = classList.find((student) => student.studentAuthID === authId).student;
    if (found) {
      return found;
    }
  });

  return (
    <div>
      <Popover
        show={show}
        right={-2.5}
        setShow={setShow}
        minWidth={96}
        content={
          <ul>
            {listWithNames &&
              listWithNames.map(
                (person) =>
                  person && (
                    <BlockedStudent
                      key={person.authId}
                      unblock={unblock}
                      person={person}
                    />
                  )
              )}
          </ul>
        }>
        <h6 className="w-auto theme-text hover:theme-text:600 hover:underline">
          see blocked students
        </h6>
      </Popover>
    </div>
  );
};

export default BlockedStudents;

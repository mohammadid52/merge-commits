import {API, graphqlOperation} from 'aws-amplify';
import {Fragment, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {useHistory} from 'react-router';

import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import AddButton from 'atoms/Buttons/AddButton';
import PageWrapper from 'atoms/PageWrapper';
import Tooltip from 'atoms/Tooltip';
import {useGlobalContext} from 'contexts/GlobalContext';
import {updateCurriculumSyllabusSequence} from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {reorder} from 'utilities/strings';

interface SyllabusListProps {
  curricularId?: string;
  institutionId: string;
  loading?: boolean;
  syllabusList: any[];
  syllabusSequence: any[];
}

const SyllabusList = (props: SyllabusListProps) => {
  const history = useHistory();

  const {curricularId, institutionId, loading, syllabusList, syllabusSequence} = props;
  const {clientKey, theme, userLanguage} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const SyllabusDict = useDictionary().SYLLABUS;
  const [list, setList] = useState<any>(syllabusList);

  const createNewSyllabus = async () => {
    history.push(
      `/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/syllabus/add`
    );
  };
  const editCurrentSyllabus = (id: string) => {
    history.push(
      `/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/syllabus/edit?id=${id}`
    );
  };

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const seq = list.map((sy: any) => sy.id);
      console.log('seq', seq);
      const reorderedList = reorder(seq, result.source.index, result.destination.index);
      try {
        let data = updateSyllabusListorder(syllabusList, reorderedList);
        setList(data);
        await API.graphql(
          graphqlOperation(updateCurriculumSyllabusSequence, {
            input: {id: curricularId, universalSyllabusSeq: reorderedList}
          })
        );
      } catch (err) {
        console.log('Could not update syllabus list sequence');
      }
    }
  };

  const updateSyllabusListorder = (syllabusList: any, sequence: any) => {
    let data = syllabusList
      .map((t: any) => {
        let index = sequence?.indexOf(t.id);
        return {...t, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
    return data;
  };

  useEffect(() => {
    if (syllabusSequence) {
      let data = updateSyllabusListorder(syllabusList, syllabusSequence);
      setList(data);
    } else {
      setList(syllabusList);
    }
  }, [syllabusList]);

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-darkest   text-center pb-8 ">
            {SyllabusDict[userLanguage]['TITLE']}
          </h3>
          {loading && (
            <p className="text-center p-16"> {SyllabusDict[userLanguage]['FETCH']}</p>
          )}
          {!loading && (
            <Fragment>
              {list && list.length > 0 && (
                <Fragment>
                  <div className="flex justify-end w-8/10 m-auto ">
                    <AddButton
                      className="mx-4"
                      label={SyllabusDict[userLanguage]['ADDNEW']}
                      onClick={createNewSyllabus}
                    />
                  </div>
                  <div className="my-8 w-8/10 m-auto">
                    {/* Table Headers */}
                    <div className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-light">
                      <div className="w-1/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                        <span>{SyllabusDict[userLanguage]['NO']}</span>
                      </div>
                      <div className="w-7/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                        <span>{SyllabusDict[userLanguage]['NAME']}</span>
                      </div>
                      <div className="w-2/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
                        <span>{SyllabusDict[userLanguage]['ACTION']}</span>
                      </div>
                    </div>
                    {/* Table data */}
                    <div className="max-h-88 overflow-y-auto">
                      {/* Drag and drop listing */}
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              {list.map((item: any, index: number) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}>
                                      <div
                                        className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-lightest cursor-pointer"
                                        onClick={() => editCurrentSyllabus(item.id)}>
                                        <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                                          {index + 1}.
                                        </div>
                                        <div className="flex w-7/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                                          {item.name ? item.name : ''}
                                        </div>
                                        <span
                                          className={`w-2/10 flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]} `}>
                                          <Tooltip
                                            placement="left"
                                            text={`Click to edit`}>
                                            {SyllabusDict[userLanguage]['EDIT']}
                                          </Tooltip>
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </Fragment>
              )}
              {(!list || (list && list.length === 0)) && (
                <Fragment>
                  <div className="flex justify-center mt-8">
                    <Buttons label="Add new unit" onClick={createNewSyllabus} />
                  </div>
                  <p className="text-center p-16">
                    {' '}
                    {SyllabusDict[userLanguage]['INFO']}
                  </p>
                </Fragment>
              )}
            </Fragment>
          )}
        </PageWrapper>
      </div>
    </div>
  );
};

export default SyllabusList;

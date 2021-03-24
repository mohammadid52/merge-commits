import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../../customGraphql/customQueries';
import Selector from '../Atoms/Form/Selector';
interface Csv { }

const Csv = (props: Csv) => {
    const { state, dispatch } = useContext(GlobalContext);
    const [institutions, setInstitutions] = useState([]);
    const [selectedInst, setSelectedInst] = useState(null);

    const [instClassRooms, setInstClassRooms] = useState([]);
    const [classRoomsList, setClassRoomsList] = useState([]);
    const [selectedClassRoom, setSelectedClassRoom] = useState(null);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);

    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const [surveys, setSurveys] = useState([]);
    const [syllabusLessons, setSyllabusLessons] = useState([])
    const [selectedSurvey, setSelectedsurvey] = useState(null);

    const [surveyQuestions, setSurveyQuestions] = useState([]);
    const [demographicsQuestions, setDemographicsQuestions] = useState([]);

    const [classStudents, setClassStudents] = useState([]);

    useEffect(() => {
        listInstitutions();
    }, [])

    const listInstitutions = async () => {
        let institutions: any = await API.graphql(graphqlOperation(customQueries.getInstitutionsList))
        institutions = institutions?.data.listInstitutions?.items || []
        institutions = institutions.map((inst: any) => {
            return {
                id: inst.id,
                name: inst.name,
                value: inst.name
            }
        })
        setInstitutions(institutions)
    }

    const resetInstitution = () => {
        setInstClassRooms([])
        setClassRoomsList([])
        setSelectedClassRoom(null)
        setSelectedClass(null)
        setSelectedCurriculum(null)
    }

    const onInstSelect = async (id: string, name: string, value: string) => {
        try {
            let sInst = selectedInst;
            console.log('previous inst', sInst)
            let inst = { id, name, value };
            console.log('inst', inst)
            setSelectedInst(inst)
            if (!sInst || sInst.id !== inst.id) {
                resetInstitution();
                let instCRs: any = [];
                // fetch inst classrooms.
                let classrooms: any = await API.graphql(graphqlOperation(customQueries.getInstClassRooms, {
                    id: inst.id
                }))
                classrooms = classrooms?.data.getInstitution?.rooms?.items || []
                classrooms = classrooms.map((cr: any) => {
                    let curriculum = (cr.curricula?.items && Array.isArray(cr.curricula?.items)) ? cr.curricula?.items[0].curriculum : null
                    console.log({ id: cr.id, name: cr.name, value: cr.name, class: { ...cr.class }, curriculum });
                    instCRs.push({ id: cr.id, name: cr.name, value: cr.name })
                    return { id: cr.id, name: cr.name, value: cr.name, class: { ...cr.class }, curriculum }
                })
                setClassRoomsList(classrooms)
                setInstClassRooms(instCRs)
            }
        } catch (err) {
            console.log('inst select, fetch classrooms err', err)
        }
    }

    const onClassRoomSelect = (id: string, name: string, value: string) => {
        let cr = { id, name, value };
        setSelectedClassRoom(cr);
        let classroom = classRoomsList.filter(c => c.id === cr.id)[0]
        setSelectedClass(classroom.class)
        setSelectedCurriculum(classroom.curriculum)
        // list syllabus and checkpoints (for demographics questions)
        fetchUnits(classroom.curriculum.id)
        //fet students of the class
        fetchStudents(classroom.class.id)
    }

    
    const fetchUnits = async (curriculumId: string) => {
        try {
            let curriculumData: any = await API.graphql(graphqlOperation(customQueries.listUnits, {
                id: curriculumId
            }))
            let units = curriculumData?.data.getCurriculum?.syllabi?.items|| []
            units = units.map((syl: any) => {
                return { id: syl.id, name: syl.name, value: syl.name }
            })
            setUnits(units);
            let curricularCheckpoints = curriculumData?.data.getCurriculum.checkpoints?.items || [];
            let demographicsQues: any = [];
            let cCheckpoints: any = [];
            curricularCheckpoints.map((cc: any) => {
                cCheckpoints.push(cc.checkpoint.id)
                let questions = cc.checkpoint?.questions?.items || [];
                questions.map((q: any) => {
                    demographicsQues.push({question: q.question, checkpointID: cc.checkpoint.id})
                })
            })
            setDemographicsQuestions(demographicsQues)
        } catch (err) {
            console.log('fetch units (syllabus) error', err)
        }
    }

    const onUnitSelect = (id: string, name: string, value: string) => {
        let unit = { id, name, value };
        setSelectedUnit(unit);
        fetchSurveys(unit.id);
    }

    const fetchStudents = async (classId: string) => {
        let classData: any = await API.graphql(graphqlOperation(customQueries.fetchClassStudents, {
            id: classId
        }))
        let students = classData?.data?.getClass?.students?.items || []
        let classStudents = students.map((stu: any) => {
            return stu.student
        })
        console.log('classStudents', classStudents)
        setClassStudents(classStudents)
    }

    const fetchSurveys = async (unitId: string) => {
        try {
            let syllabusLessons: any = await API.graphql(graphqlOperation(customQueries.listSurveys, {
                id: unitId
            }))
            syllabusLessons = syllabusLessons?.data.getSyllabus?.lessons?.items || []
            let surveys: any = []
            syllabusLessons = syllabusLessons.filter((les: any) => {
                if (les.lesson && les.lesson.type === "survey") {
                    surveys.push({id: les.lesson.id, name: les.lesson.title, value: les.lesson.title });
                    return les.lesson;
                }
            })
            setSyllabusLessons(syllabusLessons)
            setSurveys(surveys);
        } catch (err) {
            console.log('fetch surveys list error', err)
        }
    }

    const onSurveySelect = (id: string, name: string, value: string) => {
        let survey = { id, name, value };
        setSelectedsurvey(survey);
        console.log('Fetch checkpoints of this survey', survey);
        listQuestions(survey.id)
    }

    const listQuestions = async (lessonId: string) => {
        try {
            let surveyQuestions: any = await API.graphql(graphqlOperation(customQueries.getSurveyQuestions, {
                id: lessonId
            }))
            let checkpoints = surveyQuestions?.data?.getLesson?.checkpoints?.items;
            console.log('checkpoints', checkpoints)
            const questions: any = [];
            checkpoints.map((cp: any) => {
                let ques = cp?.checkpoint?.questions?.items;
                ques.map((q: any) => {
                    questions.push({ question: q.question, checkpointID: cp.checkpointID })
                })
            })
            console.log('questions', questions)
            setSurveyQuestions(questions)
        } catch (err) {
            console.log('list questions error', err)
        }
    }

    return (
        <>
            <div>CSV</div>
            <div>
                <span> Select institute </span>
                <Selector
                    selectedItem={selectedInst ? selectedInst.name : ''}
                    placeholder="Select institute"
                    list={institutions}
                    onChange={(value, name, id) => onInstSelect(id, name, value)}
                />
            </div>

            <div>
                <span> Select class room </span>
                <Selector
                    selectedItem={selectedClassRoom ? selectedClassRoom.name : ''}
                    placeholder="select class room"
                    list={instClassRooms}
                    onChange={(value, name, id) => onClassRoomSelect(id, name, value)}
                />
            </div>
            {
                selectedClass ?
                    <div>
                        Selected Class: {selectedClass.name}
                    </div>
                    : null
            }
            {
                selectedCurriculum ?
                    <div>
                        Selected Curriculum: {selectedCurriculum.name}
                    </div>
                    : null
            }
            {
                selectedCurriculum ?
                    <div>
                        <span>Select Unit (syllabus)</span>
                        <Selector
                            selectedItem={selectedUnit ? selectedUnit.name : ''}
                            placeholder="select unit"
                            list={units}
                            onChange={(value, name, id) => onUnitSelect(id, name, value)}
                        />
                    </div>
                    : null
            }
            {
                selectedUnit ?
                    <div>
                        <span>Select survey (lesson)</span>
                        <Selector
                            selectedItem={selectedSurvey ? selectedSurvey.name : ''}
                            placeholder="select survey"
                            list={surveys}
                            onChange={(value, name, id) => onSurveySelect(id, name, value)}
                        />
                    </div>
                    : null
            }
            <span> ====**===========**======= ====**===========**======= </span>
            {
                selectedUnit ? 
                    <div>
                        <span>survey questions</span>
                        {
                            surveyQuestions.map((sq, index) => {
                                return (
                                    <div key={index}>
                                        <span>Question: {sq.question.question}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                : null
            }
            <span> ====**===========**======= ====**===========**======= </span>
            {
                selectedCurriculum ? 
                    <div> 
                        <span>Demographics questions</span> 
                        {
                            demographicsQuestions.map((dq, index) => {
                                return (
                                    <div key={index}>
                                        <span>Question: {dq.question.question}</span>
                                    </div>
                                )
                            })
                        }
                    </div> : null
            }
            <span> ====**===========**======= ====**===========**======= </span>
            {
                selectedClass ?
                    <div>
                        <span>Class Students</span>
                        {
                            classStudents.map((stu, index) => {
                                return (
                                    <div key={index}>
                                        <span>student: email: {stu.email}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    : null
            }

        </>
    );
};

export default Csv;

import API, {graphqlOperation} from '@aws-amplify/api';
import Buttons from '@components/Atoms/Buttons';
import SelectorWithAvatar from '@components/Atoms/Form/SelectorWithAvatar';
import RichTextEditor from '@components/Atoms/RichTextEditor';
import Media from '@components/Community/Components/Media';
import {IFile} from '@components/Community/constants.community';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import * as customQueries from '@customGraphql/customQueries';
import * as queries from '@graphql/queries';
import {ISpotlightInput} from '@interfaces/Community.interfaces';
import {getFilterORArray} from '@utilities/strings';
import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';

const Spotlight = ({
  instId,
  onCancel,
  onSubmit,
}: {
  instId?: string;
  onCancel: () => void;
  onSubmit: (input: ISpotlightInput) => void;
}) => {
  const [teachersList, setTeachersList] = useState([]);
  const [file, setFile] = useState<IFile>();

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [fields, setFields] = useState<{summary: string; summaryHtml: string}>({
    summary: '',
    summaryHtml: '',
  });

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setUnsavedChanges(true);
    setFields({...fields, [field]: text, [fieldHtml]: html});
  };

  const initialData = {
    id: '',
    name: '',
    institute: {id: instId, name: '', value: ''},
    teacher: {id: '', name: '', value: ''},
  };
  const [roomData, setRoomData] = useState(initialData);

  const [fetched, setFetched] = useState(false);

  const selectTeacher = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      teacher: {
        id: id,
        name: name,
        value: val,
      },
    });
  };

  const getInstituteInfo = async (instId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.getInstitution, {
          id: instId,
        })
      );
      setRoomData((prevData) => ({
        ...prevData,
        institute: {
          ...prevData.institute,
          name: list.data.getInstitution?.name,
        },
      }));
      const serviceProviders = list.data.getInstitution?.serviceProviders?.items;
      return serviceProviders;
    } catch {}
  };

  const fetchOtherList = async () => {
    const items: any = await getInstituteInfo(instId);
    const serviceProviders = items.map((item: any) => item.providerID);
    const allInstiId = [...serviceProviders, instId];
    getTeachersList(allInstiId);
  };

  useEffect(() => {
    if (roomData.institute.id) {
      setFetched(false);
      fetchOtherList();
      setFetched(true);
    }
  }, [roomData.institute.id]);

  const getTeachersList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listStaffs, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')},
        })
      );
      const listStaffs = list.data.listStaffs.items;

      if (listStaffs?.length === 0) {
      } else {
        const sortedList = listStaffs.sort((a: any, b: any) =>
          a.staffMember?.firstName?.toLowerCase() >
          b.staffMember?.firstName?.toLowerCase()
            ? 1
            : -1
        );
        const filterByRole = sortedList.filter(
          (teacher: any) =>
            teacher.staffMember?.role === 'TR' || teacher.staffMember?.role === 'FLW'
        );
        const staffList = filterByRole.map((item: any) => ({
          id: item.staffMember?.id,
          name: `${item.staffMember?.firstName || ''} ${
            item.staffMember?.lastName || ''
          }`,
          value: `${item.staffMember?.firstName || ''} ${
            item.staffMember?.lastName || ''
          }`,
          email: item.staffMember?.email ? item.staffMember?.email : '',
          authId: item.staffMember?.authId ? item.staffMember?.authId : '',
          image: item.staffMember?.image,
        }));
        // Removed duplicates from staff list.
        const uniqIDs: string[] = [];
        const filteredArray = staffList.filter((member: {id: string}) => {
          const duplicate = uniqIDs.includes(member.id);
          uniqIDs.push(member.id);
          return !duplicate;
        });

        setTeachersList(filteredArray);
      }
    } catch {}
  };

  const {teacher} = roomData;

  const [error, setError] = useState('');

  const validateFields = () => {
    let isValid = true;
    if (teacher === undefined) {
      setError('Please select person');
      isValid = false;
    } else if (isEmpty(file)) {
      setError('Image or video not found');
      isValid = false;
    } else if (!fields.summary) {
      setError('Please add description');
      isValid = false;
    } else {
      setError('');
      isValid = true;
    }
    return isValid;
  };

  const _onSubmit = () => {
    const isValid = validateFields();
    if (isValid) {
      const spotlightDetails: ISpotlightInput = {
        cardImageLink: file.fileKey,
        summary: fields.summary,
        additionalLinks: [teacher.id],
      };
      onSubmit(spotlightDetails);
    }
  };

  return (
    <div className="min-w-256 max-w-256">
      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Step 1: Select person in the community to spotlight
          <span className="text-red-500"> *</span>
        </label>

        <SelectorWithAvatar
          selectedItem={teacher}
          list={teachersList}
          loading={!fetched && teachersList.length === 0}
          placeholder={'Select Person'}
          onChange={selectTeacher}
        />
      </div>
      <Media setError={setError} setFile={setFile} file={file} />

      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Add a note about the person
          <span className="text-red-500"> *</span>
        </label>
        <div>
          <RichTextEditor
            placeholder={'Why do you want to put this person in the community spotlight?'}
            withStyles
            initialValue={fields.summary}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(htmlContent, plainText, 'summaryHtml', 'summary')
            }
          />

          <div className="text-right text-gray-400">{fields.summary.length} of 750</div>
        </div>
      </div>
      <AnimatedContainer show={Boolean(error)}>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </AnimatedContainer>

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={'Cancel'}
            onClick={onCancel}
            transparent
          />
          <Buttons btnClass="py-1 px-8 text-xs ml-2" label={'Save'} onClick={_onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Spotlight;

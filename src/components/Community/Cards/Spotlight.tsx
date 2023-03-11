import Buttons from "atoms/Buttons";
import SelectorWithAvatar from "atoms/Form/SelectorWithAvatar";
import RichTextEditor from "atoms/RichTextEditor";
import { API, graphqlOperation } from "aws-amplify";
import Media from "components/Community/Components/Media";
import {
  COMMUNITY_UPLOAD_KEY,
  IFile,
} from "components/Community/constants.community";
import { REGEX } from "components/Lesson/UniversalLessonBuilder/UI/common/constants";
import AnimatedContainer from "components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer";
import * as customQueries from "customGraphql/customQueries";
import useAuth from "customHooks/useAuth";
import * as queries from "graphql/queries";
import {
  ICommunityCardProps,
  ISpotlightInput,
} from "interfaces/Community.interfaces";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { getImageFromS3Static } from "utilities/services";
import { getFilterORArray } from "utilities/strings";

const Spotlight = ({
  instId,
  onCancel,
  onSubmit,
  editMode,
  cardDetails,
}: ICommunityCardProps) => {
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [file, setFile] = useState<IFile>();
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [tempData, setTempData] = useState<any>(null);

  useEffect(() => {
    if (editMode && !isEmpty(cardDetails)) {
      const additionalLinks = cardDetails?.additionalLinks;

      if (teachersList.length > 0) {
        const teacher = teachersList.find(
          (teacher) =>
            teacher.id ===
            (additionalLinks &&
              additionalLinks.length > 0 &&
              additionalLinks[cardDetails?.cardImageLink ? 0 : 1])
        );

        setSelectedPerson(teacher);
      }

      if (
        cardDetails?.additionalLinks &&
        cardDetails?.additionalLinks?.length > 1
      ) {
        setYoutubeVideoLink(cardDetails.additionalLinks[1]);
      }

      setTempData({
        image: cardDetails.cardImageLink,
      });

      if (
        !cardDetails.cardImageLink &&
        additionalLinks &&
        additionalLinks?.length > 0 &&
        additionalLinks?.[0]
      ) {
        setYoutubeVideoLink(additionalLinks[0]);
      }

      // this method is not working with text editor. doesn't work ❌
      // trying to add initial value to useState. finally this method works ✅. (check useState for fields for ref.)

      // setFields({
      //   ...fields,

      //   summary: cardDetails?.summary || '',
      //   summaryHtml: cardDetails?.summaryHtml || '',
      // });
    }
  }, [editMode, cardDetails, teachersList]);

  const [_, setUnsavedChanges] = useState(false);
  const [fields, setFields] = useState<{
    summary: string;
    summaryHtml: string;
  }>({
    summary: editMode && !isEmpty(cardDetails) ? cardDetails?.summary : "",
    summaryHtml:
      editMode && !isEmpty(cardDetails) ? cardDetails?.summaryHtml || "" : "",
  });

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setUnsavedChanges(true);
    setFields({ ...fields, [field]: text, [fieldHtml]: html });
  };

  const [isLoading, setIsLoading] = useState(false);

  const initialData = {
    id: "",
    name: "",
    institute: { id: instId, name: "", value: "" },
    teacher: { id: "", name: "", value: "" },
  };
  const [roomData, setRoomData] = useState(initialData);

  const [selectedPerson, setSelectedPerson] = useState({
    id: "",
    name: "",
    value: "",
  });

  const selectPerson = (val: string, name: string, id: string) => {
    setSelectedPerson({ id: id, name: name, value: val });
  };

  useEffect(() => {
    fetchStudentList();
  }, []);

  const { authId } = useAuth();

  const fetchStudentList = async () => {
    setLoadingStudents(true);
    const response: any = await API.graphql(
      graphqlOperation(customQueries.getDashboardDataForTeachers, {
        filter: { teacherAuthID: { eq: authId } },
      })
    );
    const assignedRoomsAsCoTeacher: any = await API.graphql(
      graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
        filter: { teacherAuthID: { eq: authId } },
      })
    );
    const data = [
      ...response?.data?.listRooms?.items,
      ...assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items?.map(
        (item: any) => ({
          ...item,
          ...item.room,
          teacher: item.room?.teacher,
        })
      ),
    ];

    let list: any[] = [];
    let uniqIds: string[] = [];

    if (data?.length) {
      data.forEach((item: any) => {
        item?.class?.students?.items.forEach((student: any) => {
          if (!uniqIds.includes(student.student.id)) {
            list.push({
              id: student.student.id,
              name: `${student.student.firstName} ${student.student.lastName}`,
              image: student?.student?.image,
              value: `${student.student.firstName} ${student.student.lastName}`,
            });
            uniqIds.push(student.student.id);
          }
        });
      });
    }

    setStudentsList(list);
    setLoadingStudents(false);
  };

  const getInstituteInfo = async (instId: string) => {
    setLoadingTeachers(true);
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
      const serviceProviders =
        list.data.getInstitution?.serviceProviders?.items;
      return serviceProviders;
    } catch {}
  };

  const fetchOtherList = async () => {
    if (instId) {
      const items: any = await getInstituteInfo(instId);
      const serviceProviders = items.map((item: any) => item.providerID);
      const allInstiId = [...serviceProviders, instId];
      getTeachersList(allInstiId);
    }
  };

  useEffect(() => {
    if (roomData.institute.id) {
      fetchOtherList();
    }
  }, [roomData.institute.id]);

  const getTeachersList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listStaff, {
          filter: { or: getFilterORArray(allInstiId, "institutionID") },
        })
      );
      const listStaffs = list.data.listStaff.items;

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
            teacher.staffMember?.role === "TR" ||
            teacher.staffMember?.role === "FLW"
        );
        const staffList = filterByRole.map((item: any) => ({
          id: item.staffMember?.id,
          name: `${item.staffMember?.firstName || ""} ${
            item.staffMember?.lastName || ""
          }`,
          value: `${item.staffMember?.firstName || ""} ${
            item.staffMember?.lastName || ""
          }`,
          email: item.staffMember?.email ? item.staffMember?.email : "",
          authId: item.staffMember?.authId ? item.staffMember?.authId : "",
          image: item.staffMember?.image,
        }));
        // Removed duplicates from staff list.
        const uniqIDs: string[] = [];
        const filteredArray = staffList.filter((member: { id: string }) => {
          const duplicate = uniqIDs.includes(member.id);
          uniqIDs.push(member.id);
          return !duplicate;
        });

        setTeachersList(filteredArray);
      }
    } catch {
    } finally {
      setLoadingTeachers(false);
    }
  };

  const { teacher } = roomData;

  const [error, setError] = useState("");

  const validateFields = () => {
    let isValid = true;

    if (teacher === undefined) {
      setError("Please select person");
      isValid = false;
    } else if (!editMode && !youtubeVideoLink && isEmpty(file)) {
      setError("Image or video not found");
      isValid = false;
    } else if (!fields.summary) {
      setError("Please add description");
      isValid = false;
    } else if (
      !youtubeVideoLink &&
      !tempData?.image &&
      !youtubeVideoLink &&
      isEmpty(file)
    ) {
      setError("Please add youtube/vimeo link");
      isValid = false;
    } else if (youtubeVideoLink && !REGEX.Youtube.test(youtubeVideoLink)) {
      setError("Invalid Url");
      isValid = false;
    } else {
      setError("");
      isValid = true;
    }
    return isValid;
  };

  const _onSubmit = () => {
    const isValid = validateFields();
    if (isValid) {
      setIsLoading(true);
      let spotlightDetails: ISpotlightInput = {
        summary: fields.summary,
        summaryHtml: fields.summaryHtml,
        additionalLinks: [selectedPerson.id],
        cardImageLink: editMode
          ? file && file?.fileKey
            ? file?.fileKey
            : cardDetails?.cardImageLink
          : file?.fileKey,
        id: cardDetails?.id,
        isEditedCard: editMode,
      };

      if (!editMode) {
        delete spotlightDetails.id;
      }
      if (youtubeVideoLink) {
        spotlightDetails = {
          ...spotlightDetails,
          cardImageLink: "",
          additionalLinks: [youtubeVideoLink, selectedPerson.id],
        };
      }

      onSubmit(spotlightDetails, () => setIsLoading(false));
    }
  };

  const [youtubeVideoLink, setYoutubeVideoLink] = useState("");
  const mediaProps = {
    videoLink: youtubeVideoLink,
    setVideoLink: setYoutubeVideoLink,
    setError: setError,
    setFile: setFile,
    file: file,
  };

  return (
    <div className="">
      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Step 1: Select person in the community to spotlight
          <span className="text-red-500"> *</span>
        </label>

        <SelectorWithAvatar
          dataCy="spotlight"
          selectedItem={selectedPerson}
          list={[...teachersList, ...studentsList]}
          imageFromS3
          loading={loadingStudents || loadingTeachers}
          placeholder={"Select Person"}
          onChange={selectPerson}
        />
      </div>
      {tempData && tempData?.image ? (
        <div>
          {/* @ts-ignore */}
          <Media
            initialImage={getImageFromS3Static(
              COMMUNITY_UPLOAD_KEY +
                (!isEmpty(file) && file?._status === "success"
                  ? file?.fileKey
                  : tempData?.image)
            )}
            {...mediaProps}
          />
        </div>
      ) : (
        // @ts-ignore
        <Media
          initialImage={
            !isEmpty(file) && file?._status === "success"
              ? getImageFromS3Static(COMMUNITY_UPLOAD_KEY + file?.fileKey)
              : "null"
          }
          {...mediaProps}
        />
      )}

      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Add a note about the person
          <span className="text-red-500"> *</span>
        </label>
        <div>
          <RichTextEditor
            placeholder={
              "Why do you want to put this person in the community spotlight?"
            }
            rounded
            customStyle
            initialValue={fields.summary}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(
                htmlContent,
                plainText,
                "summaryHtml",
                "summary"
              )
            }
          />

          <div className="text-right text-gray-400">
            {fields.summary.length} of 750
          </div>
        </div>
      </div>
      <AnimatedContainer show={Boolean(error)}>
        {error && <p className="mx-4 text-red-500 text-xs">{error}</p>}
      </AnimatedContainer>

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={"Cancel"}
            onClick={onCancel}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            dataCy="save-spotlight-button"
            label={"Save"}
            loading={isLoading}
            // disabled={
            //   (!editMode && isEmpty(file) && file?._status !== 'success') ||
            //   (youtubeVideoLink && !REGEX.Youtube.test(youtubeVideoLink))
            // }
            onClick={_onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Spotlight;

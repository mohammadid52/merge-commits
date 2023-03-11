import { API, graphqlOperation } from "aws-amplify";
import * as customQueries from "customGraphql/customQueries";
import orderBy from "lodash/orderBy";
import { useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import Modal from "atoms/Modal";
import useTailwindBreakpoint from "customHooks/tailwindBreakpoint";
import AttendanceList from "./AttendanceFrame/AttendanceList";

const pad = (num: any) => {
  return `0${num}`.slice(-2);
};

const limit: number = 10;

interface IAttendanceProps {
  selectedRoomId?: string;
  role?: string;
  visible?: boolean;
  rightView?: { view: string; option?: string };
  setRightView?: any;
  studentID?: string;
  roster?: any[];
}

const Attendance = ({
  selectedRoomId,
  role,
  visible,

  setRightView,
  studentID,
  roster,
}: IAttendanceProps) => {
  // ##################################################################### //
  // ############################ LOADING USER ########################### //
  // ##################################################################### //
  // ~~~~~~~~~~ LOADING AND STATUS ~~~~~~~~~ //
  const [user, setUser] = useState<any>();
  useEffect(() => {
    if (visible && studentID && roster) {
      const findPersonInRoster = roster.find(
        (person: any) => person.person.id === studentID
      );
      if (findPersonInRoster?.person) {
        setUser(findPersonInRoster.person);
      }
    }
  }, [visible, studentID, roster]);

  // ##################################################################### //
  // ######################### LOADING ATTENDACE ######################### //
  // ##################################################################### //
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    fieldName: string;
    order: boolean | "desc" | "asc";
  }>({
    fieldName: "",
    order: false,
  });
  const [nextToken, setNextToken] = useState<string>("");

  useEffect(() => {
    if (studentID) {
      fetchAttendance();
    }
  }, [studentID]);

  const fetchAttendance = async (
    date?: Date | null,
    fetchNewRecords: boolean = false
  ) => {
    try {
      setLoading(true);
      let payload: any = {
        studentID: studentID,
        roomID: selectedRoomId,
        sortDirection: "DESC",
        date,
        limit,
      };
      if (nextToken) {
        payload.nextToken = nextToken;
      }
      if (selectedRoomId) {
        payload.filter = { roomID: { eq: selectedRoomId } };
      }
      if (date) {
        const dayNumber = date.getDate();
        const monthNumber = date.getMonth();
        const year = date.getFullYear();

        payload.date = {
          eq: `${year}-${pad(monthNumber + 1)}-${pad(dayNumber)}`,
        };
      }
      const list: any = await API.graphql(
        graphqlOperation(customQueries.attendanceByStudent, payload)
      );
      const temp = list?.data.attendanceByStudent?.items.map((record: any) => ({
        ...record,
        lessonName: record.lesson?.title,
        curriculumName: record.curriculum?.name,
        roomName: record.room?.name,
      }));
      if (fetchNewRecords) {
        setAttendanceList(temp);
      } else {
        setAttendanceList((prevAttendance: any) => [
          ...prevAttendance,
          ...temp,
        ]);
      }
      setNextToken(list?.data.attendanceByStudent?.nextToken);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onLoadMore = () => {
    fetchAttendance(date);
  };

  const handleDateChange = (date: Date | null) => {
    setDate(date);
    fetchAttendance(date, true);
  };

  const handleOrderBy = (
    fieldName: string,
    order: boolean | "desc" | "asc"
  ) => {
    setSortConfig({
      fieldName,
      order,
    });
    setAttendanceList(orderBy(attendanceList, [fieldName], [order]));
  };

  const withOrderBy = (columnName: string, fieldName: string) => {
    return (
      <span className="w-auto mx-auto">
        <span className="w-auto">{columnName}</span>
        <span className="w-auto inline-flex items-center ml-1 cursor-pointer">
          <span
            className={`w-auto ${
              fieldName === sortConfig.fieldName && sortConfig.order === "desc"
                ? "text-dark-gray"
                : ""
            }`}
          >
            <FaArrowDown className="w-2" />
          </span>
          <span
            className={`w-auto ${
              fieldName === sortConfig.fieldName && sortConfig.order === "asc"
                ? "text-dark-gray"
                : ""
            }`}
          >
            <FaArrowUp className="w-2" />
          </span>
        </span>
      </span>
    );
  };

  // ##################################################################### //
  // ########################### ANIMATION REF ########################### //
  // ##################################################################### //
  const frameRef = useRef<any>(null);

  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //
  const { breakpoint } = useTailwindBreakpoint();

  const name = user?.firstName
    ? `${user?.firstName} ${user?.lastName}`
    : user?.preferredName || "";

  return (
    <div
      ref={frameRef}
      style={{
        width:
          breakpoint === "xl" || breakpoint === "2xl"
            ? "75%"
            : "calc(100% - 36px)",
      }}
      className={`absolute mr-0 top-0 right-0 h-full flex flex-col items-center z-50`}
    >
      {visible && (
        <Modal
          customTitle={user ? `Attendance for ${name}` : "Attendance"}
          showHeader={true}
          showHeaderBorder={false}
          showFooter={false}
          scrollHidden={true}
          closeAction={() => setRightView({ view: "lesson", option: "" })}
          position={"absolute"}
        >
          <AttendanceList
            loading={loading}
            attendanceList={attendanceList}
            nextToken={nextToken}
            role={role}
            onLoadMore={onLoadMore}
            handleDateChange={handleDateChange}
            handleOrderBy={handleOrderBy}
            withOrderBy={withOrderBy}
            sortConfig={sortConfig}
          />
        </Modal>
      )}
      ;
    </div>
  );
};

export default Attendance;

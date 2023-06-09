import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import moment from 'moment';

interface IAttendanceListProps {
  loading: boolean;
  attendanceList: any[];
  nextToken?: string;
  role?: string;
  onLoadMore: () => void;
  handleDateChange: (date: Date | null) => void;
  handleOrderBy: (fieldName: string, order: boolean | 'desc' | 'asc') => void;
  withOrderBy: (columnName: string, fieldName: string) => any;
  sortConfig: {
    fieldName: string;
    order: boolean | 'desc' | 'asc';
  };
}

const AttendanceList = ({
  loading,
  attendanceList,
  nextToken,

  onLoadMore,
  handleOrderBy,
  withOrderBy,
  sortConfig
}: IAttendanceListProps) => {
  // ##################################################################### //
  // ############################# RESPONSIVE ############################ //
  // ##################################################################### //

  return (
    <div className="rounded shadow-5">
      <div className="flex flex-row bg-lightest  flex-shrink-0">
        <div
          className="w-2/10 text-left  p-3 text-xs font-semibold text-medium  uppercase tracking-wider"
          onClick={() =>
            handleOrderBy(
              'roomName',
              sortConfig.fieldName === 'roomName'
                ? sortConfig.order === 'desc'
                  ? 'asc'
                  : 'desc'
                : 'desc'
            )
          }>
          {withOrderBy('ClassName', 'roomName')}
        </div>
        <div
          className="w-2/10 text-left p-3 text-xs font-semibold text-medium  uppercase overflow-hidden tracking-wider"
          onClick={() =>
            handleOrderBy(
              'curriculumName',
              sortConfig.fieldName === 'curriculumName'
                ? sortConfig.order === 'desc'
                  ? 'asc'
                  : 'desc'
                : 'desc'
            )
          }>
          {withOrderBy('Curriculum', 'curriculumName')}
        </div>
        <div
          className="w-3/10 text-left p-3 text-xs font-semibold text-medium  uppercase overflow-hidden tracking-wider"
          onClick={() =>
            handleOrderBy(
              'lessonName',
              sortConfig.fieldName === 'lessonName'
                ? sortConfig.order === 'desc'
                  ? 'asc'
                  : 'desc'
                : 'desc'
            )
          }>
          {withOrderBy('Lesson', 'lessonName')}
        </div>
        <div
          style={{width: '15%'}}
          className="text-left  p-3 text-xs font-semibold text-medium  uppercase tracking-wider">
          Date
        </div>
        <div
          style={{width: '15%'}}
          className="text-left  p-3 text-xs font-semibold text-medium  uppercase tracking-wider">
          Time
        </div>
      </div>

      {/* BODY */}
      <div>
        {loading && !attendanceList.length ? (
          <div>
            <div className="py-3">
              <Loader />
            </div>
          </div>
        ) : attendanceList.length ? (
          attendanceList.map((item: any, idx: number) => {
            return (
              <div
                key={`${item.class?.name}_${idx}`}
                className={`${
                  idx % 2 === 0 ? 'bg-white' : 'bg-lightest '
                } flex flex-row`}>
                <div className="w-2/10 text-left p-3 overflow-hidden text-sm font-bold text-medium ">
                  {item.roomName || '-'}
                </div>
                <div className="w-2/10 text-left p-3 overflow-hidden text-sm text-medium ">
                  {item.curriculumName || '-'}
                </div>
                <div className="w-3/10 text-left p-3 overflow-hidden text-sm text-medium ">
                  {item.lessonName || '-'}
                </div>
                <div
                  style={{width: '15%'}}
                  className="text-left p-3 overflow-hidden text-sm text-medium ">
                  {new Date(item.date).toLocaleDateString()}
                  {/* {moment(item.date).format('DD/MM/YYYY')} */}
                </div>
                <div
                  style={{width: '15%'}}
                  className="text-left p-3 overflow-hidden text-sm text-medium ">
                  {moment(item?.time, 'HH:mm:ss').format('hh:mm A')}
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <div className="py-3 text-dark text-center">No records found</div>
          </div>
        )}
      </div>
      {nextToken && (
        <div className="relative flex flex-shrink-0 justify-center w-full">
          <Buttons
            label={loading ? 'loading' : 'Load more'}
            disabled={loading}
            onClick={onLoadMore}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceList;

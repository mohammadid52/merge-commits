import React, {useState} from 'react';
interface UserInfoProps {
  status: string;
}

const TestCasesInfo = (props: UserInfoProps) => {
  const {status} = props;
  const [tableData, setTableData] = useState([]);

  const theadStyles =
    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
  const tdataStyles = 'px-6 py-4 whitespace-nowrap text-sm text-gray-800';

  // if (status !== 'done') {
  //   return <LessonLoading />;
  // }

  {
    return (
      <div className="w-full md:px-4 pt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" style={{width: '15%'}} className={theadStyles}>
                Id
              </th>
              <th scope="col" style={{width: '20%'}} className={theadStyles}>
                test id
              </th>
              <th scope="col" style={{width: '15%'}} className={theadStyles}>
                test Name
              </th>
              <th scope="col" style={{width: '20%'}} className={theadStyles}>
                test type
              </th>
              <th scope="col" style={{width: '20%'}} className={theadStyles}>
                test steps
              </th>
              <th scope="col" style={{width: '20%'}} className={theadStyles}>
                test data
              </th>
              <th scope="col" style={{width: '20%'}} className={theadStyles}>
                test expected results
              </th>
              <th scope="col" style={{width: '20%'}} className={theadStyles}>
                edge cases
              </th>
              <th scope="col" style={{width: '20%'}} className={theadStyles}>
                status
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((listItem, idx) => {
              return (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td style={{width: '15%'}} className={tdataStyles}>
                    {listItem.id}
                  </td>
                  <td style={{width: '20%'}} className={tdataStyles}>
                    {listItem.testID}
                  </td>
                  <td style={{width: '15%'}} className={tdataStyles}>
                    {listItem.testName}
                  </td>
                  <td style={{width: '20%'}} className={tdataStyles}>
                    {listItem.testType}
                  </td>
                  <td style={{width: '20%'}} className={tdataStyles}>
                    {listItem.testSteps}
                  </td>
                  <td style={{width: '10%'}} className={tdataStyles}>
                    {listItem.testData}
                  </td>
                  <td style={{width: '10%'}} className={tdataStyles}>
                    {listItem.testExpResults}
                  </td>
                  <td style={{width: '10%'}} className={tdataStyles}>
                    {listItem.edgeCases}
                  </td>
                  <td style={{width: '10%'}} className={tdataStyles}>
                    Success
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default TestCasesInfo;

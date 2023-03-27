import Buttons from '@components/Atoms/Buttons';
import {PDFDownloadLink} from '@react-pdf/renderer';
import {getTodayDate} from '@utilities/functions';
import {Checkbox, Form, Switch, Tooltip} from 'antd';
import {CSVLink} from 'react-csv';
import {BsDownload} from 'react-icons/bs';
import SurveyPDF from '../SurveyPDF';

interface DownloadCsvButtonsInterface {
  isCSVDownloadReady: boolean;
  lessonPDFData: any[];
  selectedSurvey: any;
  CSVData: any;
  mappedHeaders: any[];
  selectedClassRoom: any;
  showTestData: boolean;
  setShowTestData: (value: boolean) => void;
  responseValue: boolean;
  setResponseValue: (value: boolean) => void;
}

const DownloadCsvButtons = ({
  selectedSurvey,
  mappedHeaders,
  selectedClassRoom,
  isCSVDownloadReady,
  lessonPDFData,
  CSVData,
  showTestData,
  setShowTestData,
  responseValue,
  setResponseValue
}: DownloadCsvButtonsInterface) => {
  const DISABLED_TEXT = 'First select all filters';

  const disabled = !isCSVDownloadReady;
  return (
    <div className="w-auto   py-4 justify-between xl:justify-end md:gap-4 relative flex items-center">
      {/* <div className="flex items-center gap-4">
        <Tooltip title={disabled ? DISABLED_TEXT : 'Include test data in result'}>
          <Form.Item
            style={{margin: 0}}
            label={'include test data'}
            valuePropName="checked">
            <Checkbox
              disabled={disabled}
              checked={showTestData}
              onChange={(e) => setShowTestData(e.target.checked)}
            />
          </Form.Item>
        </Tooltip>
        <Tooltip
          title={
            disabled
              ? DISABLED_TEXT
              : responseValue
              ? 'Show responses as values'
              : 'Show responses as texts'
          }>
          <Form.Item
            style={{margin: 0}}
            label={'Values as responses'}
            valuePropName="checked">
            <Switch
              checked={responseValue}
              disabled={disabled}
              onClick={() => setResponseValue(!responseValue)}
            />
          </Form.Item>
        </Tooltip>
      </div> */}

      <div className="flex items-center gap-4">
        <Buttons
          disabled={disabled && lessonPDFData.length === 0}
          Icon={BsDownload}
          tooltip={disabled ? DISABLED_TEXT : undefined}
          size="small"
          variant="link"
          insideElement={
            <PDFDownloadLink
              className={`${
                disabled && lessonPDFData.length === 0 ? ' pointer-events-none' : ''
              } w-auto ml-2`}
              document={<SurveyPDF lessonPDFData={lessonPDFData} />}
              fileName={`${selectedSurvey?.name}.pdf`}>
              Download PDF Survey
            </PDFDownloadLink>
          }
        />

        <Buttons
          disabled={disabled}
          Icon={BsDownload}
          size="small"
          tooltip={disabled ? DISABLED_TEXT : undefined}
          variant="link"
          insideElement={
            <CSVLink
              data={CSVData}
              className={`${disabled ? ' pointer-events-none' : ''} w-auto ml-2`}
              id="csv-download-button"
              headers={mappedHeaders}
              filename={`${selectedClassRoom?.label}_${
                selectedSurvey?.name
              }_${getTodayDate()}.csv`}>
              Download Survey Results
            </CSVLink>
          }
        />
      </div>
    </div>
  );
};

export default DownloadCsvButtons;

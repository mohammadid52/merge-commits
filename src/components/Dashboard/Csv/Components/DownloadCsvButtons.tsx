import Buttons from '@components/Atoms/Buttons';
import {PDFDownloadLink} from '@react-pdf/renderer';
import {getTodayDate} from '@utilities/functions';
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
}

const DownloadCsvButtons = ({
  selectedSurvey,
  mappedHeaders,
  selectedClassRoom,
  isCSVDownloadReady,
  lessonPDFData,
  CSVData
}: DownloadCsvButtonsInterface) => {
  return (
    <div className="w-auto   py-4 justify-between xl:justify-start md:gap-x-4 relative flex items-center">
      <Buttons
        disabled={!isCSVDownloadReady && lessonPDFData.length === 0}
        Icon={BsDownload}
        size="small"
        insideElement={
          <PDFDownloadLink
            className={`${
              !isCSVDownloadReady && lessonPDFData.length === 0
                ? ' pointer-events-none'
                : ''
            } w-auto ml-2`}
            document={<SurveyPDF lessonPDFData={lessonPDFData} />}
            fileName={`${selectedSurvey?.name}.pdf`}>
            Download PDF Survey
          </PDFDownloadLink>
        }
      />

      <Buttons
        disabled={!isCSVDownloadReady}
        Icon={BsDownload}
        size="small"
        insideElement={
          <CSVLink
            data={CSVData}
            className={`${!isCSVDownloadReady ? ' pointer-events-none' : ''} w-auto ml-2`}
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
  );
};

export default DownloadCsvButtons;

import {Card, Descriptions, Empty} from 'antd';
import {Fragment} from 'react';

// create interface for props
interface DemographicsInfoProps {
  checkpoints: any[];
  questionData: any[];
}

const DemographicsInfo = ({checkpoints, questionData}: DemographicsInfoProps) => {
  const getQuestionResponse = (checkpointID: string, questionID: string) => {
    const selectedCheckp: any = questionData.find(
      (item: any) => item.checkpointID === checkpointID
    );

    if (selectedCheckp) {
      const questionResponce: any = selectedCheckp.responseObject?.find(
        (item: any) => item.qid === questionID
      )?.response;
      if (questionResponce) {
        const stringedResponse = questionResponce.toString();

        if (stringedResponse.includes('Other')) {
          const splitAnswer = stringedResponse.split(' || '); // this will return ["Other", "answer"]
          const answer = splitAnswer[1];
          if (answer) return answer;
          else return 'Other';
        } else {
          return questionResponce ? questionResponce.join(',') : '--';
        }
      }
    }
  };
  return (
    <div>
      {checkpoints.length > 0 ? (
        <Fragment>
          {checkpoints.map((checkpoint: any) => (
            <Fragment key={`checkpoint_${checkpoint.id}`}>
              <Card>
                <Descriptions title={checkpoint.title}>
                  {checkpoint.questions?.items.map((item: any) => (
                    <Descriptions.Item
                      key={item?.question?.id}
                      label={item?.question?.question}>
                      {item.question.type !== 'link' ? (
                        getQuestionResponse(checkpoint.id, item.question.id) || '--'
                      ) : (
                        <a
                          className="text-blue-400 hover:text-blue-600 transition-all"
                          href={getQuestionResponse(checkpoint.id, item.question.id)}>
                          {getQuestionResponse(checkpoint.id, item.question.id)}
                        </a>
                      )}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            </Fragment>
          ))}
        </Fragment>
      ) : (
        <Empty className="min-h-56" description={'No demographics data'} />
      )}
    </div>
  );
};

export default DemographicsInfo;

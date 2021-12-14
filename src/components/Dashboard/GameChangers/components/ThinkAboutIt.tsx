import FormInput from '@components/Atoms/Form/FormInput';
import {qaList} from '@components/Dashboard/GameChangers/__contstants';
import React, {useState} from 'react';

const ThinkAboutItCard = () => {
  const [answers, setAnswers] = useState<any>({});

  const onAnsChange = (e: any) => {
    const {id, value} = e.target;

    setAnswers({...answers, [id]: value});
  };

  return (
    <section>
      <h1 className="text-white text-4xl font-semibold mb-4">Think About It</h1>
      <form className="flex flex-col gap-y-6">
        {qaList.map((qa) => (
          <div>
            <FormInput
              textarea={qa.textarea}
              dark
              onChange={onAnsChange}
              key={qa.id}
              id={qa.id}
              label={qa.question}
              value={answers[qa.id]}
              placeHolder={qa.placeholder}
            />
          </div>
        ))}
      </form>
    </section>
  );
};

export default ThinkAboutItCard;

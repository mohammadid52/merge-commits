import FormInput from 'atoms/Form/FormInput';
import {qaList} from 'components/Dashboard/GameChangers/__contstants';
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
          <div key={qa.id}>
            <label className={` text-white block text-xs font-semibold leading-5 `}>
              {qa.question}{' '}
            </label>
            <FormInput
              textarea={qa.textarea}
              dark
              onChange={onAnsChange}
              id={qa.id}
              value={answers[qa.id]}
              rows={qa.textarea ? 3 : undefined}
              placeHolder={qa.placeholder}
            />
          </div>
        ))}
      </form>
    </section>
  );
};

export default ThinkAboutItCard;

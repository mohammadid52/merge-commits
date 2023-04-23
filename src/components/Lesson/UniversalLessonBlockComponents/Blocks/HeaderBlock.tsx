import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import React, {useState} from 'react';
import {ParagraphBlock} from './ParagraphBlock';
import './styles/HeaderStyles.scss';
import {GrNotes} from 'react-icons/gr';
import {Popover, Tooltip} from 'antd';
import Modal from '@components/Atoms/Modal';
import {CgNotes} from 'react-icons/cg';

interface HeaderBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  pagePartId?: string;
}

export const HeaderBlock = (props: HeaderBlockProps) => {
  const {id, value, type, classString, pagePartId = ''} = props;

  const composeHeader = (inputID: string, inputValue: any) => {
    return (
      <h1
        id={inputID}
        dangerouslySetInnerHTML={{
          __html: inputValue.value
        }}
        className={`relative ${classString} w-full flex font-medium   text-left flex-row items-center  mt-4 mb-2`}></h1>
    );
  };

  const [showNotesModal, setShowNotesModal] = useState(false);

  return (
    <div className="w-auto">
      <Modal
        closeAction={() => setShowNotesModal(false)}
        title="Notes for Teacher"
        open={showNotesModal}>
        {value && value.length === 3 && (
          <span
            dangerouslySetInnerHTML={{
              __html: value[2].value
            }}></span>
        )}
      </Modal>

      {value && value.length > 0 && id && (
        <>
          <div key={id} className="relative">
            {composeHeader(id, value[0])}

            {/* if lenght is 3. that means it has notes for teacher */}
            {value.length === 3 &&
              value[2]?.value !== '' &&
              value[2]?.value !== '<p></p>' && (
                <div className="absolute right-0 top-0">
                  <Tooltip title="Notes for Teacher">
                    <CgNotes
                      onClick={() => setShowNotesModal(true)}
                      style={{fill: 'white'}}
                      className="text-white cursor-pointer"
                    />
                  </Tooltip>
                </div>
              )}
          </div>

          {value[1] !== '' && value[1] !== '<p></p>' && (
            <ParagraphBlock
              mode="lesson"
              pagePartId={pagePartId}
              value={[value[1]]}
              id={id}
              type={type}
            />
          )}
        </>
      )}
    </div>
  );
};

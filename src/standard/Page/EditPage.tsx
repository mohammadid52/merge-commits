import React from 'react';
//make sure you are importing from the correct folder
import Form from '../Form/Form';
import SaveButton from '../Button/SaveButton';
import CancelButton from '../Button/CancelButton';

const EditPage: React.FC = () => {

    return (
        //change WIDTH or PADDING if needed
        <div className="h-full w-full md:p-6">

            <Form />
            <Form />

            <div className="p-4 w-full flex justify-end">
                <div className="flex w-4/10">
                <CancelButton />
                <SaveButton />
                </div>
            </div>

           
        </div>
    )

}

export default EditPage;
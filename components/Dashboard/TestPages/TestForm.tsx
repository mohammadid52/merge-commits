import React, {ReactElement} from 'react';

import InputText from "../../General/Form/FormElements";

import Form from '../../General/Form';

const TestForm = (): ReactElement => {
    return (
        <>


            <Form id={'myTestForm'} name={'theName'} autocomplete={false}>

                <h1>This is just a test form prototype</h1>
                <InputText id={'someID'} label={'labelaleb'} name={'whocare'}/>

            </Form>
        </>
    )
}

export default TestForm;
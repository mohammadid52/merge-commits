import React, {useState, ReactElement, ReactNode} from 'react';

/**
 *
 * Import reusable form components
 *
 * */

interface Form {
    children: React.FC | ReactNode | ReactElement;
    id: string;
    name: string;
    autocomplete: boolean;
}

const Form: React.FC<Form> = ({children, id, name}: Form) => {
    const [formState, setFormState] = useState({
        id: null,
        content:[]
    })

    // sortAndSetData

    // collectInputData

    // handleInputChange()

    return (
        <form id={id} name={name}>
            {children}
        </form>
    )
}

export default Form;
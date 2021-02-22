import React, {ReactElement, ReactNode} from "react";

/**
 *
 * Interface mike
 *
 * */

interface FormElements {
    id: string | number;
    className: string;
    name: string;
    label: string;
    placeholder: string;
}

type InputText = Pick<FormElements, "id" | "label" | "name">;

const InputText: React.FC<InputText> = (props: InputText) => {
    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
                <input type="text" name="email" id="email"
                       className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                       placeholder="you@example.com"/>
            </div>
        </div>
    )
}

export default InputText;
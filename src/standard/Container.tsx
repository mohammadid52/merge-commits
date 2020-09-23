import React, {useContext} from 'react';
//make sure you are importing from the correct folder
import { GlobalContext } from '../contexts/GlobalContext';
import ViewPage from './Page/ViewPage';
import List from './List/List';
import EditPage from './Page/EditPage'
import ErrorNote from './Alert/ErrorNote';
import SuccessNote from './Alert/SuccessNote';
import NegativeAlert from './Alert/NegativeAlert';
import PositiveAlert from './Alert/PositiveAlert';
import Toggle from './Button/Toggle';
import Search from './List/Search';
import Badge from './Wall/Badge';
import Button from './Button/Button';
import SaveButton from './Button/SaveButton';
import CancelButton from './Button/CancelButton';
import Form from './Form/Form';
import MenuDropdown from './MenuDropdown';


const Container = () => {
    const { theme } = useContext(GlobalContext);

    return (

        <div className="w-9/10 h-full main_container">
            <div className={`w-full h-full white_container p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
           




            </div>
        </div>
    )

}

export default Container;
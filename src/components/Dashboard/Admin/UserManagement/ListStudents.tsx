import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import UserRole from './UserRole';
import UserStatus from './UserStatus';
import { getImageFromS3 } from '../../../../utilities/services';
import { getAsset } from '../../../../assets';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';

interface ListProps {
    item: any
}

const List = (props: ListProps) => {
    const { item } = props;
    const { theme, clientKey,userLanguage } = useContext(GlobalContext);
    const themeColor = getAsset(clientKey, 'themeClassName');
    const { BUTTONS  } = useDictionary(clientKey);
    const match = useRouteMatch();
    const history = useHistory();
    const [imageUrl, setImageUrl] = useState('')

    const initials = (firstName: string, lastName: string) => {
        let firstInitial = firstName.charAt(0).toUpperCase()
        let lastInitial = lastName.charAt(0).toUpperCase()
        return firstInitial + lastInitial;
    }

    const handleLink = (e: any) => {
        const { id } = e.target
        history.push(`${match.url}/user?id=${id}`)
    }

    const stringToHslColor = (str: string) => {
        let hash = 0;
        let i;
        for (i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        let h = hash % 360;
        return 'hsl(' + h + ', 70%, 72%)';
    }

    useEffect(() => {
        async function getUrl() {
            const imageUrl: any = await getImageFromS3(item.image);
            setImageUrl(imageUrl);
        }
        getUrl();

    }, [item.image])

    return (
        ///change INFO, MARGIN and WIDTH if needed
        <>
            {item.role === 'ST' || item.role === 'TR' ?
                <div id={item.id} className="flex justify-between bg-white w-full border-b border-gray-200">

                    <div className="w-4/10 px-8 py-4 whitespace-no-wrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                {item.image ?
                                    (<img
                                        src={imageUrl}
                                        className="h-8 w-8 rounded-full" />) :
                                    <div className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold" style={{ background: `${stringToHslColor(item.firstName + ' ' + item.lastName)}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                                        {initials(item.preferredName ? item.preferredName : item.firstName, item.lastName)}
                                    </div>}
                            </div>
                            <div className="ml-2">
                                <div id={item.id} className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900" onClick={handleLink} >
                                    {`${item.lastName}, ${item.preferredName ? item.preferredName : item.firstName}`}
                                </div>
                                <div id={item.id} className="text-sm leading-5 text-gray-500">
                                    {item.email}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-no-wrap">
                        <span id={item.id} className="w-auto text-sm leading-5 text-gray-500">
                            <UserRole
                                role={item.role ? item.role : '--'} />
                        </span>
                    </div>
                    {/* <div className="w-3.5/10 flex justify-center px-8 py-4 whitespace-no-wrap">
                        <div className="flex flex-col justify-center items-center">
                            <div id={item.id} className="w-auto text-sm leading-5 text-gray-900">{item.institution ? item.institution : '--'}</div>
                            <div id={item.id} className="w-auto text-sm leading-5 text-gray-500">{item.grade ? item.grade : '--'}</div>
                        </div>
                    </div> */}
                    <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-no-wrap">
                        <div className="w-16 flex justify-center">
                            <UserStatus
                                status={item.status ? item.status : '--'} />
                        </div>
                    </div>
                    <div className="w-2/10 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-no-wrap text-right text-sm leading-5 font-medium" onClick={handleLink} >
                        <div id={item.id} className={`flex justify-center ${theme.textColor[themeColor]} `}>{BUTTONS[userLanguage]['EDIT']}</div>
                    </div>
                </div>
                : null}
        </>
    );

}

export default List;
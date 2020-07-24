import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory, useRouteMatch } from 'react-router-dom';

const Links: React.FC = () => {
    const history = useHistory();
    const match = useRouteMatch();
    const { state } = useContext(GlobalContext);
    const initialLinks:Array<string> = [
    ];
    const [ links, setLinks ] = useState(initialLinks)

    const userLinks = (role: string): void => {
        switch(role) {
            case 'ADM':
                return setLinks(links => {
                    return [
                        ...links,
                        'Registration',
                        'Classroom',

                    ]
                })
            case 'FLW':
                return setLinks(links => {
                    return [
                        ...links,
                        'Classroom',
                    ]
                })
            default:
                return 
        }
    }

    useEffect(() => {
        userLinks(state.user.role)
        // console.log(state.user.role);
    }, [state.user.role])

    const handleLink = (e: any) => {
        let id = e.target.id.toLowerCase();
        history.push(`${match.url}/${id}`)
    }

    return (
        <div className="link w-full h-12 py-4">
            {
                state.user.role && links.length > 0 ? 
                links.map((link: string, key: number) => (
                    <div id={link} key={key} className={`w-full text-center text-lg mb-4`} onClick={handleLink}>
                        { link }
                    </div>
                )) :
                null
            }
        </div>
    )
}

export default Links;
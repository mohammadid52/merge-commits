import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../../../graphql/queries';

const UserSearch = ( search: any ) => {
    const [ data, setData ] = useState([]);
    const match = useRouteMatch();
    const history = useHistory();

    return (    
        <div className="col-span-1">
            <label htmlFor={`${search.id}`} className="sr-only">{search.name}</label>
            <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                <input id={`${search.id}`} type="search" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder={`${search.name}`}/>
            </div>
        </div>
    )
}

export default UserSearch;
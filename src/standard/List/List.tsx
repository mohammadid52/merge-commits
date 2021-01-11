import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
//make sure you are importing from the correct folder

const List = () => {
const [ data, setData ] = useState([]);
const match = useRouteMatch();
const history = useHistory();

const handleLink = (e: any) => {
    const { id } = e.target
    history.push(`${match.url}/user?id=${id}`)
}

    return (
        //change NAME and DATA ITEMS
    <div className="flex flex-col">
        <div className="-my-2 py-2">
            {/* may not need the create button */}
            <div className="w-full flex justify-end">
                <span className="w-40 flex inline-flex rounded-md shadow-sm">
                    <button type="submit" className="
                    text-indigo-700 bg-white border-indigo-700 hover:bg-indigo-600 hover:bg-opacity-50 hover:border-none focus:border-indigo-800 focus:shadow-outline-indigo active:bg-indigo-800
                    inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                        + Create Name 
                    </button>
                </span>
            </div>
            <div className="white_container shadow-5 p-8 mt-8 align-middle rounded-lg border-b border-gray-200">
            <table className="h-8/10 px-4 divide-y divide-gray-200">
                <thead className="w-full border-b border-gray-200">
                <tr>
                    <th className="px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                    </th>
                    <th className="px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                    </th>
                    <th className="px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                    </th>
                    <th className="px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Name
                    </th>
                    <th className="px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
                </thead>
            { 
        data.length > 0 ? data.map((item: any, key: number) => (
                <tbody id={item.id} key={key} className="bg-white w-full divide-y divide-gray-200">
                <tr>
                    <td className="px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        {/* full name bolded with email */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-lg" src="https://i2.wp.com/www.quartzmasters.com/wp-content/uploads/2017/03/article-user-blank.jpg?ssl=1" alt="" />
                        </div>
                        <div className="ml-4">
                            <div id={item.id} className="text-sm leading-5 font-medium text-gray-900">
                                {`${item.lastName}, ${ item.preferredName ? item.preferredName : item.firstName }`}
                            </div>
                            <div id={item.id} className="text-sm leading-5 text-gray-500">
                                { item.email }
                            </div>
                        </div>
                    </div>
                    </td>
                    <td className="px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        {/* role grey font */}
                        <span id={item.id} className="text-sm leading-5 text-gray-500">
                        { item.role }
                        </span>
                    </td>
                    <td className="px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        {/* institute bolded with grade greyed */}
                        <div id={item.id} className="text-sm leading-5 text-gray-900">{item.institution ? item.institution : 'Institution Name'}</div>
                        <div id={item.id} className="text-sm leading-5 text-gray-500">{item.grade ? item.grade : 'Grade'}</div>
                    </td>
                    <td className="px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        {/* different colors with different statuses */}
                        <span id={item.id} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-lg bg-green-100 text-green-800">
                        { item.status }
                        </span>
                    </td>
                    <td className="px-8 py-4 cursor-pointer whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium" onClick={handleLink} >
                        <div id={item.id} key={key} className="text-indigo-600 hover:text-indigo-900">View</div>
                    </td>
                </tr>

                </tbody>
                )):  null
                    
                }
                </table>
            </div>
        </div>
    </div>
    )

}

export default List;
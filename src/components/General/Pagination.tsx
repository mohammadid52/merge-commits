import React, {useEffect, useState} from 'react';

interface props {
    dataPerPage : any
    data: any
    currentPage: any
    setCurrentPage: any
}

const Pagination = (props: props) => {
    const {dataPerPage, data, currentPage, setCurrentPage} = props;
    const [posts, setPosts] = useState(data);

    useEffect(() => {
        setPosts(data);
    }, []);

    // Get current posts
    const indexOfLastPost = currentPage * dataPerPage;
    const indexOfFirstPost = indexOfLastPost - dataPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPosts = data.length;

    const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
    const forward = () => {
      setCurrentPage(currentPage + 1);
      if (currentPage >= posts.length) {
        setCurrentPage(posts.length);
      }
    };
  
    const backward = () => {
      setCurrentPage(currentPage - 1);
      if (currentPage <= 1) {
        setCurrentPage(1);
      }
    };

    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPosts / dataPerPage); i++) {
        pageNumbers.push(i)
    }


    return (
        //change the NUMBERs
      <>
       { pageNumbers.length > 1 ? <div className="absolute w-full flex items-center justify-between sm:px-6" style={{bottom: 0}}>
            <div className="flex-1 flex items-center justify-end">
                {/* <div>
                <p className="text-sm leading-5 text-gray-700">
                    <span> Showing </span>
                    <span className="font-medium">1</span>
                    <span> to </span>
                    <span className="font-medium">{data.length < 10 ? data.length : '10'}</span>
                    <span> of </span>
                    <span className="font-medium">{data.length}</span>
                    <span> results </span>
                </p>
                </div> */}
                <div className="w-3/10">
                    <nav className="relative z-0 inline-flex shadow-sm font-bold rounded-xl">
                        <div onClick={backward} className={`${currentPage === 1 ? 'text-gray-800' : 'cursor-pointer text-gray-300 hover:text-gray-400'}  font-bold relative inline-flex items-center px-2 py-2 rounded-l-md  text-sm leading-5 font-medium  focus:z-10 focus:outline-none focus:ring-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150`} aria-label="Previous">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        
                        {pageNumbers.map(number => (
                            <div key={number} onClick={() => paginate(number)} className={`${number === currentPage ? 'text-white rounded-full font-bold' : 'text-gray-700 cursor-pointer hover:text-gray-400' } font-semibold flex justify-center -ml-px relative items-center px-4 py-2  text-sm leading-5 font-medium  focus:z-10 focus:outline-none focus:border-blue-300 focus:ring-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}>
                                {number}
                            </div>
                        ))}
                        <div onClick={forward} className={`${currentPage === data.length ? 'text-gray-800' : 'cursor-pointer text-gray-300 hover:text-gray-400' } font-bold -ml-px relative inline-flex items-center px-2 py-2 rounded-r-md   text-sm leading-5 font-medium focus:z-10 focus:outline-none focus:ring-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150`} aria-label="Next">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </nav>
                </div>
            </div>
        </div> : null }
</>
    )

}

export default Pagination;
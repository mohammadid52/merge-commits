import React, { Fragment, useContext, useState } from 'react';
import {IoChevronDownCircleOutline, IoChevronUpCircleOutline} from 'react-icons/io5';

import {IconContext} from 'react-icons/lib/esm/iconContext';
import { getAsset } from '../../assets';
import { GlobalContext } from '../../contexts/GlobalContext';

const Accordion = ({titleList}: any) => {
    const {theme, clientKey} = useContext(GlobalContext);
    const themeColor = getAsset(clientKey, 'themeClassName');
    const [selectedItem, setSelectedItem] = useState('');

    const changeView = (step: string) => {
      if (selectedItem !== step) {
        setSelectedItem(step);
      } else {
        setSelectedItem('');
      }
    };
  return (
    // <section className="shadow">
    //   <article className="border-b">
    //     <div className="border-l-2 border-transparent">
    //       <header className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
    //         <span className="text-grey-darkest font-thin text-xl">
    //           Massa vitae tortor condimentum lacinia quis vel eros donec
    //         </span>
    //         <div className="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
    //           <svg
    //             aria-hidden="true"
    //             className=""
    //             data-reactid="266"
    //             fill="none"
    //             height="24"
    //             stroke="#606F7B"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             stroke-width="2"
    //             viewBox="0 0 24 24"
    //             width="24"
    //             xmlns="http://www.w3.org/2000/svg">
    //             <polyline points="6 9 12 15 18 9"></polyline>
    //           </svg>
    //         </div>
    //       </header>
    //     </div>
    //   </article>
    //   <article className="border-b">
    //     <div className="border-l-2 bg-grey-lightest border-indigo">
    //       <header className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
    //         <span className="text-indigo font-thin text-xl">
    //           Lorem ipsum dolor sit amet
    //         </span>
    //         <div className="rounded-full border border border-indigo w-7 h-7 flex items-center justify-center bg-indigo">
    //           <svg
    //             aria-hidden="true"
    //             data-reactid="281"
    //             fill="none"
    //             height="24"
    //             stroke="white"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             stroke-width="2"
    //             viewBox="0 0 24 24"
    //             width="24"
    //             xmlns="http://www.w3.org/2000/svg">
    //             <polyline points="18 15 12 9 6 15"></polyline>
    //           </svg>
    //         </div>
    //       </header>
    //       <div>
    //         <div className="pl-8 pr-8 pb-5 text-grey-darkest">
    //           <ul className="pl-4">
    //             <li className="pb-2">consectetur adipiscing elit</li>
    //             <li className="pb-2">
    //               sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
    //             </li>
    //             <li className="pb-2">
    //               Viverra orci sagittis eu volutpat odio facilisis mauris
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //   </article>
    //   <article className="border-b">
    //     <div className="border-l-2 border-transparent">
    //       <header className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
    //         <span className="text-grey-darkest font-thin text-xl">
    //           Lorem dolor sed viverra ipsum
    //         </span>
    //         <div className="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
    //           <svg
    //             aria-hidden="true"
    //             className=""
    //             data-reactid="266"
    //             fill="none"
    //             height="24"
    //             stroke="#606F7B"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             stroke-width="2"
    //             viewBox="0 0 24 24"
    //             width="24"
    //             xmlns="http://www.w3.org/2000/svg">
    //             <polyline points="6 9 12 15 18 9"></polyline>
    //           </svg>
    //         </div>
    //       </header>
    //     </div>
    //   </article>
    //   <article className="border-b">
    //     <div className="border-l-2 border-transparent">
    //       <header className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none">
    //         <span className="text-grey-darkest font-thin text-xl">
    //           Egestas sed tempus urna
    //         </span>
    //         <div className="rounded-full border border-grey w-7 h-7 flex items-center justify-center">
    //           <svg
    //             aria-hidden="true"
    //             className=""
    //             data-reactid="266"
    //             fill="none"
    //             height="24"
    //             stroke="#606F7B"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             stroke-width="2"
    //             viewBox="0 0 24 24"
    //             width="24"
    //             xmlns="http://www.w3.org/2000/svg">
    //             <polyline points="6 9 12 15 18 9"></polyline>
    //           </svg>
    //         </div>
    //       </header>
    //     </div>
    //   </article>
    // </section>
    //      <div className="container mx-auto">
    //    <div className="m-8 rounded overflow-hidden">
    //      <div className="group outline-none accordion-section" tabIndex={1}>
    //        <div className="group bg-gray-900 flex justify-between px-4 py-3 items-center text-gray-500 transition ease duration-500 cursor-pointer pr-10 relative">
    //          <div className="group-focus:text-white transition ease duration-500">
    //            Title for Tab - 1
    //          </div>
    //          <div className="h-8 w-8 border border-gray-700 rounded-full items-center inline-flex justify-center transform transition ease duration-500 group-focus:text-white group-focus:-rotate-180 absolute top-0 right-0 mb-auto ml-auto mt-2 mr-2">
    //            <FaChevronCircleDown />
    //          </div>
    //        </div>
    //        <div className="group-focus:max-h-screen max-h-0 bg-gray-800 px-4 overflow-hidden ease duration-500">
    //          <p className="p-2 text-gray-400 text-justify">
    //            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
    //            repellat amet doloribus consequuntur eos similique provident
    //            tempora voluptates iure quia fuga dicta voluptatibus culpa
    //            mollitia recusandae delectus id suscipit labore?
    //          </p>
    //        </div>
    //      </div>
    //      <div className="group outline-none accordion-section" tabIndex={2}>
    //        <div className="group bg-gray-900 flex justify-between px-4 py-3 items-center text-gray-500 transition ease duration-500 cursor-pointer pr-10 relative">
    //          <div className="group-focus:text-white transition ease duration-500">
    //            Title for Tab - 2
    //          </div>
    //          <div className="h-8 w-8 border border-gray-700 rounded-full items-center inline-flex justify-center transform transition ease duration-500 group-focus:text-white group-focus:-rotate-180 absolute top-0 right-0 mb-auto ml-auto mt-2 mr-2">
    //            <FaChevronCircleDown />
    //          </div>
    //        </div>
    //        <div className="group-focus:max-h-screen max-h-0 bg-gray-800 px-4 overflow-hidden ease duration-500">
    //          <p className="p-2 text-gray-400 text-justify">
    //            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
    //            repellat amet doloribus consequuntur eos similique provident
    //            tempora voluptates iure quia fuga dicta voluptatibus culpa
    //            mollitia recusandae delectus id suscipit labore?
    //          </p>
    //        </div>
    //      </div>
    //      <div className="group outline-none accordion-section" tabIndex={3}>
    //        <div className="group bg-gray-900 flex justify-between px-4 py-3 items-center text-gray-500 transition ease duration-500 cursor-pointer pr-10 relative">
    //          <div className="group-focus:text-white transition ease duration-500">
    //            Title for Tab - 3
    //          </div>
    //          <div className="h-8 w-8 border border-gray-700 rounded-full items-center inline-flex justify-center transform transition ease duration-500 group-focus:text-white group-focus:-rotate-180 absolute top-0 right-0 mb-auto ml-auto mt-2 mr-2">
    //            <FaChevronCircleDown />
    //          </div>
    //        </div>
    //        <div className="group-focus:max-h-screen max-h-0 bg-gray-800 px-4 overflow-hidden ease duration-500">
    //          <p className="p-2 text-gray-400 text-justify">
    //            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
    //            repellat amet doloribus consequuntur eos similique provident
    //            tempora voluptates iure quia fuga dicta voluptatibus culpa
    //            mollitia recusandae delectus id suscipit labore?
    //          </p>
    //        </div>
    //      </div>
    //    </div>
    //  </div>
    <div className="bg-white mx-auto  border-0 border-gray-200">
      <div>
        <ul className="rounded-xl">
          {titleList.map(
            (
              item: {
                id: string;
                title: string;
                scope?: string;
                subtitle?: string;
                content: React.ReactNode;
              },
              index: number
            ) => (
              <Fragment key={item.id}>
                <li className={`relative border-b-0 border-gray-200`}>
                  <div className="bg-gray-500">
                    <div
                      className={`w-full px-8 py-3 text-left ${theme.outlineNone} ${
                        selectedItem === item.id
                          ? `border-0 ${theme.borderColorLight[themeColor]}`
                          : ''
                      }`}>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs md:text-base font-bold cursor-pointer flex ${
                            selectedItem === item.id && theme.textColor[themeColor]
                          } `}
                          onClick={() => changeView(item.id)}>
                          <div className="w-auto text-white">
                            <span className="mr-4">{index + 1}. </span>
                          </div>
                          <div>
                            <span className="text-white">{item.title}</span>
                          </div>
                        </span>
                        <span
                          className="w-8 h-8 flex items-center cursor-pointer transition ease duration-500"
                          onClick={() => changeView(item.id)}>
                          <IconContext.Provider
                            value={{
                              size: '2rem',
                              color: 'white',
                            }}>
                            {selectedItem === item.id ? (
                              <IoChevronUpCircleOutline />
                            ) : (
                              <IoChevronDownCircleOutline />
                            )}
                          </IconContext.Provider>
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedItem === item.id && (
                    <div className="px-8 py-3 max-h-140 overflow-auto ease duration-500">
                      {item.content}
                    </div>
                  )}
                </li>
              </Fragment>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default Accordion;

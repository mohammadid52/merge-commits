import {Transition} from '@headlessui/react';
import {forEach, map} from 'lodash';
import React from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {BsCloudDownload} from 'react-icons/bs';
import {getImageFromS3Static} from '../../../../../utilities/services';

const Downloadables = ({showDownloadMenu, setShowDownloadMenu, downloadables}: any) => {
  const mapDownloadablesFilesTogether = () => {
    let res: {id: string; imgId: string; fileName?: string}[] = [];
    forEach(downloadables, (d) => {
      if (d.partContent && d.partContent.length > 0) {
        forEach(d.partContent, (_d) => {
          if (_d.value && _d.value.length > 0) {
            forEach(_d.value, (f) => {
              const state = {id: f.id, imgId: f.value, fileName: f.label};
              res.push(state);
            });
          }
        });
      }
    });
    return res;
  };

  const allFiles = mapDownloadablesFilesTogether();

  return (
    <div className="flex items-center justify-center w-16 fixed bottom-5 right-5 z-100">
      <ClickAwayListener onClickAway={() => setShowDownloadMenu(false)}>
        <div
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          className="flex items-center relative justify-center h-12 w-12 rounded-full cursor-pointer dark:bg-gray-700 bg-blue-500">
          <BsCloudDownload className="text-lg text-white" />
          <span style={{top: 10, right: 10}} className="absolute flex h-3 w-3">
            <span className="animate-ping absolute inline-flex iconoclast:bg-400 curate:bg-400 h-full w-full rounded-full opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 iconoclast:bg-500 curate:bg-500"></span>
          </span>
          <Transition
            enter="transform transition ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            style={{bottom: '1.5rem'}}
            onClick={(e: any) => e.stopPropagation()}
            className="w-auto bg-white dark:bg-gray-800 dark:border-gray-700 cursor-default select-none rounded-xl customShadow absolute right-1 border-0 border-gray-200 min-h-32 min-w-140 p-4"
            show={showDownloadMenu}>
            <h3 className="text-lg pb-4 dark:text-white leading-6 font-medium text-gray-900">
              Downloadable Files
            </h3>
            <div className="border-t-0 py-4 dark:border-gray-700 border-gray-200 grid grid-cols-1 gap-x-4 max-h-132 overflow-y-auto gap-y-4">
              {allFiles && allFiles.length > 0 ? (
                map(allFiles, (d) => {
                  return (
                    <div className="col-span-1 flex items-center justify-between text-sm break-all dark:text-gray-400 font-medium">
                      <p className="w-auto text-gray-500">{d.fileName}</p>
                      <a
                        href={getImageFromS3Static(d.imgId)}
                        download={d.fileName}
                        className={`inline-flex w-auto border-2 items-center px-2 py-0.5 text-xs font-medium border-gray-500 ml-2 rounded-full hover:border-gray-600 cursor-pointer transition-all text-gray-500 hover:text-gray-600`}>
                        Download
                      </a>
                    </div>
                  );
                })
              ) : (
                <p className="w-auto text-gray-500 text-center">
                  No files available to download
                </p>
              )}
            </div>
          </Transition>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default Downloadables;

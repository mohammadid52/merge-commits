import {Transition} from '@headlessui/react';
import {forEach, map} from 'lodash';
import React, {useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {BsCheckCircle, BsCloudDownload} from 'react-icons/bs';
import {IoClose} from 'react-icons/io5';
import {setTimeout} from 'timers';
import Storage from '@aws-amplify/storage';

export function downloadBlob(blob: any, filename: string, cb: any) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  const clickHandler = () => {
    if (cb) {
      cb();
    }
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener('click', clickHandler);
    }, 150);
  };
  a.addEventListener('click', clickHandler, false);

  a.click();
  return a;
}

// usage
async function download(fileKey: string, filename: string, cb: any) {
  const result = await Storage.get(`ULB/studentdata_${fileKey}`, {download: true});
  // @ts-ignore
  downloadBlob(result.Body, filename, cb);
}

const Download = ({file}: {file: {id: string; fileKey: string; fileName?: string}}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  return (
    <div className="col-span-1 flex items-center justify-between text-sm break-all dark:text-gray-400 font-medium">
      <p className="w-auto text-gray-500">{file.fileName}</p>
      {isDownloaded ? (
        <span className="h-6 w-6 block text-green-400">
          <BsCheckCircle className="h-full w-full" />
        </span>
      ) : (
        <span
          className="inline-flex w-auto border-2 items-center px-2 py-0.5 text-xs font-medium border-gray-500 ml-2 rounded-full hover:bg-gray-600 cursor-pointer transition-all text-gray-500 hover:text-gray-800 hover:border-gray-800"
          onClick={() => {
            download(file.fileKey, file.fileName, () => setIsDownloaded(true));
          }}>
          <a id="download-file" target="_blank" className={``}>
            Download
          </a>
        </span>
      )}
    </div>
  );
};

const Downloadables = ({showDownloadMenu, setShowDownloadMenu, downloadables}: any) => {
  const mapDownloadablesFilesTogether = () => {
    let res: {id: string; fileKey: string; fileName?: string}[] = [];
    forEach(downloadables, (d) => {
      if (d.partContent && d.partContent.length > 0) {
        forEach(d.partContent, (_d) => {
          if (_d.value && _d.value.length > 0) {
            forEach(_d.value, (f) => {
              const state = {id: f.id, fileKey: f.value, fileName: f.label};
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
    <div className="flex items-center justify-center w-16 fixed bottom-5 right-8 lg:w-18 xl:w-20 z-50">
      <ClickAwayListener onClickAway={() => setShowDownloadMenu(false)}>
        <div
          title={`downloadables files ${
            allFiles.length > 0 ? `(${allFiles.length})` : ''
          }`}
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          className="flex items-center relative justify-center h-12 w-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full cursor-pointer iconoclast:bg-500 curate:bg-500">
          <BsCloudDownload className="text-lg lg:text-xl text-white" />
          {/* <span style={{top: 10, right: 10}} className="absolute flex h-3 w-3">
            <span className="animate-ping absolute inline-flex bg-white bg-opacity-90 h-full w-full rounded-full opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span> */}
          <Transition
            enter="transform transition ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="opacity-100"
            title=""
            leaveTo="opacity-0"
            style={{bottom: '1.5rem'}}
            onClick={(e: any) => e.stopPropagation()}
            className="w-auto bg-white dark:bg-gray-800 dark:border-gray-700 cursor-default select-none rounded-xl customShadow absolute right-1 border-0 border-gray-200 min-h-32 min-w-140 p-4"
            show={showDownloadMenu}>
            <div className="flex items-center pb-2 justify-between">
              <h3 className="text-lg  dark:text-white leading-6 font-medium text-gray-900">
                Downloadable Files {allFiles.length > 0 ? `(${allFiles.length})` : ''}
              </h3>
              <span
                title="close"
                onClick={() => setShowDownloadMenu(false)}
                role="button"
                aria-label="close button"
                className="w-6 h-6 block cursor-pointer dark:text-gray-400 text-gray-800">
                <IoClose className="h-full w-full" />
              </span>
            </div>
            <div className="border-t-0 pt-4 dark:border-gray-700 border-gray-200 grid grid-cols-1 gap-x-4 max-h-132 overflow-y-auto gap-y-4">
              {allFiles && allFiles.length > 0 ? (
                map(allFiles, (d) => <Download key={d.id} file={d} />)
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

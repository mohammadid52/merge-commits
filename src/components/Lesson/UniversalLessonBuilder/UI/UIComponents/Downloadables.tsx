import {Storage} from 'aws-amplify';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {Transition} from '@headlessui/react';
import {forEach, map} from 'lodash';
import React, {useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {BsCheckCircle, BsCloudDownload} from 'react-icons/bs';
import {IoClose} from 'react-icons/io5';

import {ellipsis} from 'utilities/functions';
import {UPLOAD_KEYS} from '../../../constants';

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
const UPLOAD_KEY = UPLOAD_KEYS.TEACHER_UPLOAD;

async function download(fileKey: string, filename: string, cb: any) {
  const result = await Storage.get(`${UPLOAD_KEY}${fileKey}`, {
    download: true
  });
  // @ts-ignore
  downloadBlob(result.Body, filename, cb);
}

const Download = ({file}: {file: {id: string; fileKey: string; fileName?: string}}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  return (
    <div className="col-span-1 flex-col md:flex-row  flex items-start md:items-center justify-between text-sm break-all dark:text-light  font-medium">
      <p title={file.fileName} className="w-auto text-medium ">
        {ellipsis(file.fileName || '', 50)}
      </p>
      {isDownloaded ? (
        <span className="h-6 w-6 block text-green-400">
          <BsCheckCircle className="h-full w-full" />
        </span>
      ) : (
        <span
          className="inline-flex w-auto items-center px-2 py-0.5 text-xs font-medium hover:iconoclast:bg-500 hover:curate:bg-500 md:ml-2 rounded-full  cursor-pointer transition-all  iconoclast:bg-main curate:bg-main mt-2 md:mt-0 "
          onClick={() => {
            file &&
              download(file.fileKey, file?.fileName || '', () => setIsDownloaded(true));
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

  const {breakpoint} = useTailwindBreakpoint();

  return (
    <div className="flex items-center justify-center ">
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
            style={{
              bottom: '1.5rem',
              right: breakpoint === 'md' ? '-85px' : undefined
            }}
            onClick={(e: any) => e.stopPropagation()}
            className="w-auto bg-white dark:bg-darkest    dark:border-dark   cursor-default select-none rounded-xl customShadow absolute right-1 border-0 border-lightest min-h-32 min-w-56 sm:min-w-96 md:min-w-140 p-4"
            show={showDownloadMenu}>
            <div className="flex items-center pb-2 justify-between">
              <h3 className="text-lg  dark:text-white leading-6 font-medium text-darkest">
                Downloadable Files {allFiles.length > 0 ? `(${allFiles.length})` : ''}
              </h3>
              <span
                title="close"
                onClick={() => setShowDownloadMenu(false)}
                role="button"
                aria-label="close button"
                className="w-6 h-6 block cursor-pointer dark:text-light  text-darkest   ">
                <IoClose className="h-full w-full" />
              </span>
            </div>
            <div className="border-t-0 pt-4 dark:border-dark   border-lightest grid grid-cols-1 gap-x-4 max-h-132 overflow-y-auto gap-y-4">
              {allFiles && allFiles.length > 0 ? (
                map(allFiles, (d) => <Download key={d.id} file={d} />)
              ) : (
                <p className="w-auto text-medium  text-center">
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

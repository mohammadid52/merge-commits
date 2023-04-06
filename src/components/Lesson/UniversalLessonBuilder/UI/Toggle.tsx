import {Switch} from '@headlessui/react';
import React from 'react';
import {IconType} from 'react-icons/lib';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const Toggle = ({
  enabled,
  enabledColor = 'bg-medium ',
  disabledColor = 'bg-orange-200',
  setEnabled,
  enableIcon: EIcon,
  disableIcon: DIcon,
  disabled
}: {
  enableIcon?: IconType;
  disableIcon?: IconType;
  enabled: boolean;
  disabled?: boolean;
  enabledColor?: string;
  disabledColor?: string;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      disabled={disabled}
      className={classNames(
        enabled ? enabledColor : disabledColor,
        'relative ml-2 inline-flex flex-shrink-0 h-4 w-7 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      )}>
      <span className="sr-only">Use setting</span>
      <span
        title="toggle"
        className={classNames(
          enabled ? 'translate-x-3' : 'translate-x-0',
          'pointer-events-none relative inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
        )}>
        <span
          className={classNames(
            enabled
              ? 'opacity-0 ease-out duration-100'
              : 'opacity-100 ease-in duration-200',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
          )}>
          {DIcon && <DIcon className="h-3 w-3" aria-hidden="true" />}
        </span>
        <span
          className={classNames(
            enabled
              ? 'opacity-100 ease-in duration-200'
              : 'opacity-0 ease-out duration-100',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
          )}
          aria-hidden="true">
          {EIcon && <EIcon className="h-3 w-3" aria-hidden="true" />}
        </span>
      </span>
    </Switch>
  );
};
export default Toggle;

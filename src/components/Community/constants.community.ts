import {AiOutlineSound} from 'react-icons/ai';
import {BiConversation} from 'react-icons/bi';
import {BsCalendar} from 'react-icons/bs';
import {HiOutlineSpeakerphone} from 'react-icons/hi';

export interface IFile {
  _status: 'progress' | 'failed' | 'success' | 'other';
  progress: number | string | null;
  file: File;
  id?: string;
  fileKey?: string;
  fileName?: string;
}

export interface IFileComponent extends IFile {
  UPLOAD_KEY?: string;
}

export const communityTypes = {
  SPOTLIGHT: 'spotlight',
  ANNOUNCEMENTS: 'announcement',
  EVENT: 'event',
  CHECK_IT_OUT: 'check_it_out',
};

export const communityContent = [
  {
    subtitle: 'Feature a new student or celebrate an achievement',
    name: 'Spotlight',
    type: communityTypes.SPOTLIGHT,
    icon: AiOutlineSound,
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-100',
  },
  {
    subtitle: 'Let the community know what is going on in the community',
    name: 'Announcement',
    type: communityTypes.ANNOUNCEMENTS,
    icon: HiOutlineSpeakerphone,
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-100',
  },
  {
    subtitle: 'Let the community know about stuff to do in the future',
    name: 'Event',
    type: communityTypes.EVENT,
    icon: BsCalendar,
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-100',
  },
  {
    subtitle: 'Start a conversation with the community',
    name: 'Check It Out',
    type: communityTypes.CHECK_IT_OUT,
    icon: BiConversation,
    iconForeground: 'text-blue-700',
    iconBackground: 'bg-blue-100',
  },
];
export type NavStateTypes =
  | 'init'
  | 'spotlight'
  | 'announcement'
  | 'event'
  | 'check_it_out';

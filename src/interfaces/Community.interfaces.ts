export interface ISpotlightInput {
  cardImageLink?: string;
  summary: string;
  additionalLinks?: string[];
  cardId?: string;
  isEditedCard?: boolean;
}

export interface IAnnouncementInput extends ISpotlightInput {
  cardName?: string;
}
export interface IEventInput extends IAnnouncementInput {
  startTime: string;
  endTime: string;
  additionalInfo?: string;
  address?: string;
}
export interface ICheckItOutInput extends IAnnouncementInput {}

export interface IPerson {
  image: string;
  firstName: string;
  lastName: string;
  role?: string;
}
export interface ICommunityCard extends IEventInput {
  id: string;
  cardName?: string;
  cardType?: string;
  personAuthID?: string;
  person?: IPerson;
  cardDate?: string;
  chat: IChat[];
  likes?: string[];
  chatCount?: number;
}

export interface IChat {
  id?: string;
  communityId: string;
  createdAt?: string;
  person?: IPerson;
  personAuthID: string;
  personEmail: string;
  msg?: string | null;
  isEditedChat?: boolean;
}

export interface ICommunityCardProps {
  instId?: string;
  onCancel: () => void;
  onSubmit: (
    input: ISpotlightInput | IAnnouncementInput | IEventInput | ICheckItOutInput
  ) => void;
  editMode?: boolean;
  cardDetails?: ICommunityCard;
}

export interface ISpotlightInput {
  cardImageLink?: string;
  summary: string;
  additionalLinks?: string[];
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

export interface ICommunityCard extends IEventInput {
  id: string;
  cardName?: string;
  cardType?: string;

  person: {
    image: string;
    firstName: string;
    lastName: string;
    role?: string;
  };
  cardDate?: string;
  chat: IChat[];
}

export interface IChat {
  id: string;
  communityId: string;
  personAuthID: string;
  personEmail: string;
  msg?: string | null;
}

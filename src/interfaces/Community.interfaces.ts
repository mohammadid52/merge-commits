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
  date: string;
  address?: string;
}
export interface ICheckItOutInput extends IAnnouncementInput {}

export interface ICommunityCard extends IEventInput {
  cardName?: string;
  cardType?: string;
  additionalInfo?: string;
  person: {
    image: string;
    firstName: string;
    lastName: string;
  };
}

export interface NotificationListItem {
  check: boolean;
  notification:{
    label?: string;
    message?: string;
    type?: string;
    cta?: string;
  };
  action?: () => any;
}
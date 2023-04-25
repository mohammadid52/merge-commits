export interface NotificationListItem {
  check: boolean;
  notification: {
    label?: string;
    message?: string | null;
    type?: string;
    cta?: string;
  };
  action?: () => any;
  cancel?: () => any;
}

export interface Notification {
  category: 'error' | 'alert' | 'info' | 'help' | 'tip';
  message: string;
  link: string;
  linkText: string;
  linkFunction: () => any;
}
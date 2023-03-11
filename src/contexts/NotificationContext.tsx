import React, { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext<any>(null);
type INotification = {
  show: boolean;
  dark?: boolean;
  title: string;
  buttonText?: string;
  buttonUrl?: string;
  timeout?: number;

  type?: "success" | "error" | "info";
};

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<INotification>({
    show: false,
    title: "",
    buttonText: "",
    buttonUrl: "",
    dark: false,
    timeout: 5000,
    type: "info",
  });

  const clearNotification = () => {
    setNotification({ title: "", buttonText: "", buttonUrl: "", show: false });
  };

  useEffect(() => {
    if (notification.show) {
      setTimeout(() => {
        clearNotification();
      }, notification.timeout);
    }
  }, [notification.show]);

  return (
    <NotificationContext.Provider
      // @ts-ignore
      value={{
        notification,
        setNotification,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): {
  notification: INotification;
  setNotification: React.Dispatch<React.SetStateAction<INotification>>;
  clearNotification: () => void;
} => useContext(NotificationContext);

export default NotificationContextProvider;

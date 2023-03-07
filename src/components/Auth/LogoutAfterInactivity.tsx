import {useEffect, useState} from 'react';

const LogoutAfterInactivity = ({logout}: {logout: any}): any => {
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    new Date().getTime()
  );

  useEffect(() => {
    const inactivityDuration = 60 * 30 * 1000; // 30 minutes in milliseconds

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeSinceLastActivity = currentTime - lastActivityTimestamp;

      if (timeSinceLastActivity >= inactivityDuration) {
        logout();
      }
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, [lastActivityTimestamp, logout]);

  const handleUserActivity = () => {
    setLastActivityTimestamp(new Date().getTime());
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keypress', handleUserActivity);

    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keypress', handleUserActivity);
    };
  }, []);

  return null;
};

export default LogoutAfterInactivity;

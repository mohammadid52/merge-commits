import {useEffect, useState} from 'react';

const useMultiKeypress = (keyName: string) => {
  let keys = {
    a: false,
    b: false,
  };

  const [keyPressed, setKeyPressed] = useState(false);

  const onKeyDown = (event: any) => {
    if ('Meta' === event.key || 'Ctrl' === event.key) {
      keys.a = true;
    }

    if (keyName === event.key) {
      keys.b = true;
    }

    if (keys.a && keys.b) {
      setKeyPressed(true);
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    setKeyPressed(false);
    keys.a = false;
    keys.b = false;
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return keyPressed;
};

export default useMultiKeypress;

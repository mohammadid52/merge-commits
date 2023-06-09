import Buttons from '@components/Atoms/Buttons';
import useAuth from '@customHooks/useAuth';
import {FiLogOut} from 'react-icons/all';

const SignOutButton = () => {
  const {signOut} = useAuth();

  return (
    <>
      <Buttons
        redBtn
        Icon={FiLogOut}
        label="Sign Out"
        size="small"
        className="w-full"
        onClick={signOut}
        variant="default"
      />
    </>
  );
};

export default SignOutButton;

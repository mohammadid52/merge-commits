import useAuth from '@customHooks/useAuth';
import {FiLogOut} from 'react-icons/all';

const SignOutButton = () => {
  const {signOut} = useAuth();

  return (
    <>
      <div
        data-cy="logout-button"
        onClick={signOut}
        className="flex-shrink-0 mt-2 flex border-t p-2 px-4 hover:iconoclast:bg-400 hover:curate:bg-400 hover:text-white rounded-full mb-2">
        <div className="flex-shrink-0 group block">
          <div className="flex items-center">
            <FiLogOut size="24px" className="cursor-pointer w-auto mr-1" />

            <p className="text-sm ml-2 font-medium">Logout</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignOutButton;

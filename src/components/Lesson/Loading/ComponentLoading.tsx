import { getAsset } from "assets";
import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";

const ComponentLoading = () => {
  const { clientKey, userLanguage } = useGlobalContext();
  const { appDict } = useDictionary();

  return (
    <div
      id="component-loading"
      className="min-h-screen h-screen w-full text-gray-200  font-light flex flex-col justify-center items-center"
    >
      <div className="w-auto">
        <div className=" theme-card-shadow max-w-96 rounded-lg">
          <div
            className={`p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light bg-white rounded-t-lg`}
          >
            <img
              src={getAsset(clientKey, "loading_logo")}
              alt={`${clientKey} Logo`}
            />
          </div>
          <div
            className={`  p-4 text-sm text-center text-white flex flex-col justify-center items-center font-light iconoclast:bg-500 curate:bg-500    rounded-b-lg`}
          >
            <p>{appDict[userLanguage].LOADING} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLoading;

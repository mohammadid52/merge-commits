import { Auth } from "aws-amplify";
import useAuth from "@customHooks/useAuth";
import { getInstInfo, getPerson } from "@graphql/functions";
import { getUserInfo } from "@utilities/functions";
import { getAsset } from "assets";
import AuthRoutes from "components/AppRoutes/AuthRoutes";
import UnauthRoutes from "components/AppRoutes/UnauthRoutes";
import MobileOops from "components/Error/MobileOops";
import ComponentLoading from "components/Lesson/Loading/ComponentLoading";
import { useGlobalContext } from "contexts/GlobalContext";
import useDeviceDetect from "customHooks/deviceDetect";
import React, { Suspense, useEffect, useState } from "react";
import { forEach } from "lodash";

const MainRouter: React.FC = () => {
  const deviceDetected = useDeviceDetect();
  const { theme, authState, updateAuthState, clientKey } = useGlobalContext();

  const [readyState, setReadyState] = useState("loading");

  useEffect(() => {
    if (authState === "loggedIn") {
      //  do nothing
    } else {
      if (authState !== "loading") {
        removeAuthToken();
      }
    }
  }, [authState]);

  useEffect(() => {
    document.addEventListener("readystatechange", function () {
      setReadyState(document.readyState);
    });
    setupAppHeaders();
    checkUserAuthenticated();
  }, []);

  const setupAppHeaders = async () => {
    document.title = getAsset(clientKey, "appTitle");
    const favicon: any = document.getElementById("faviconDefault");
    const favicon32x32: any = document.getElementById("favicon32x32");
    const favicon16x16: any = document.getElementById("favicon16x16");
    const manifest: any = document.getElementById("manifest");
    const maskIcon: any = document.getElementById("maskIcon");
    favicon.href = getAsset(clientKey, "faviconDefault");
    favicon32x32.href = getAsset(clientKey, "favicon32x32");
    favicon16x16.href = getAsset(clientKey, "favicon16x16");
    manifest.href = getAsset(clientKey, "manifest");
    maskIcon.href = getAsset(clientKey, "maskIcon");

    const metaTags = [
      { name: "apple-mobile-web-app-title", content: "webAppTitle" },
      { name: "application-name", content: "appName" },
      { name: "msapplication-TileImage", content: "tileImage" },
      { name: "msapplication-config", content: "msapplicationConfig" },
    ];

    forEach(metaTags, (meta) => {
      if (document !== null) {
        const element = document?.querySelector(`meta[name="${meta.name}"]`);
        element?.setAttribute("content", getAsset(clientKey, meta.content));
      }
    });

    const html = document?.querySelector("html");
    html?.classList?.add?.(clientKey === "demo" ? "curate" : clientKey);
  };

  const { setUser, removeAuthToken } = useAuth();

  const checkUserAuthenticated = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        const { email, sub } = user.attributes;

        const userInfo = await getPerson(email, sub);

        let instInfo: any =
          userInfo.role !== "ST" ? await getInstInfo(sub) : {};

        updateAuthState(true);

        // SETUP USER
        setUser({
          email,
          authId: sub,

          associateInstitute:
            instInfo?.data?.listStaff?.items.filter(
              (item: any) => item.institution
            ) || [],
          ...getUserInfo(userInfo),
        });
      } else {
        updateAuthState(false);
      }
    } catch (err) {
      // logError(
      //   err,
      //   {authId: state.user.authId, email: state.user.email},
      //   'AppMainRouter @checkUserAuthenticated'
      // );
      updateAuthState(false);
    }
  };

  if (readyState !== "complete") {
    return (
      <div className="min-h-screen   w-full flex flex-col justify-center items-center">
        <ComponentLoading />
      </div>
    );
  } else {
    return (
      <div
        className={`iconoclast:bg-50 curate:bg-50 h-screen md:max-w-full md:h-screen w-full overflow-x-hidden ${theme.bg} flex flex-col`}
      >
        {false && deviceDetected.mobile ? (
          <MobileOops userAgent={deviceDetected.device} />
        ) : (
          <Suspense
            fallback={
              <div className="min-h-screen __polka-pattern w-full flex flex-col justify-center items-center">
                <ComponentLoading />
              </div>
            }
          >
            {authState === "loggedIn" && <AuthRoutes />}
            {authState === "notLoggedIn" && <UnauthRoutes />}
          </Suspense>
        )}
      </div>
    );
  }
};

export default MainRouter;

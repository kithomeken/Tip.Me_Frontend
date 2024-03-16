import React from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Auth from "./Auth";
import Crypto from '../../security/Crypto'
import { useAppSelector } from "../../store/hooks";
import { Header } from "../../components/layouts/Header";
import StorageServices from "../../services/StorageServices";
import { STORAGE_KEYS } from "../../global/ConstantsRegistry";
import { standardErrorRoutes } from "../../routes/errorRoutes";
import { CoreSideBar } from "../../components/layouts/CoreSideBar";
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions";

export default function CoreSettingsRouteGuard() {
    const dispatch: any = useDispatch()
    const location = useLocation()
    const currentLocation = location.pathname

    const auth0: any = useAppSelector(state => state.auth0)
    const sessionState = Auth.checkAuthentication(auth0)

    const state = {
        from: currentLocation
    }

    if (!sessionState.authenticated) {
        if (sessionState.status.resetSession) {
            /* 
             * Redux session state is authenticated
             * but cookies are not set.
             * 
             * Reset session and start all-over again
            */

            dispatch(revokeAuthSession())
            return
        } else {
            // Redirect to sign-in
            return <Navigate to="/auth/sign-in" replace state={state} />;
        }
    } else {
        const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)
        const storageObject = JSON.parse(encryptedKeyString)

        let identityData: any = Crypto.decryptDataUsingAES256(storageObject)
        identityData = JSON.parse(identityData)

        if (identityData.type !== 'A') {
            return <Navigate to={'/home'} replace />;
        }

        if (sessionState.status.disabled) {
            // Suspended accounts
            const suspendAccountRoute: any = (standardErrorRoutes.find((routeName) => routeName.name === 'SUSP_ACC'))?.path
            return <Navigate to={suspendAccountRoute} replace />;
        }
    }

    return (
        <React.Fragment>
            <div className="flex flex-row h-screen bg-gray-100">

                <Header />

                <CoreSideBar
                    location={location}
                />

                <div className="flex-grow md:ml-64 ml-0 scroll-smooth overflow-y-auto text-gray-800">
                    <div className="w-full p-4 pt-20 flex flex-col h-screen">

                        <Outlet />

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

import { useDispatch } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { Header } from "../../components/layouts/Header"
import { standardRoutes } from "../../routes/standardRoutes"
import StorageServices from "../../services/StorageServices"
import { standardErrorRoutes } from "../../routes/errorRoutes"
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"
import { CONFIG_MARGIN_TOP, STORAGE_KEYS } from "../../global/ConstantsRegistry"

export default function StandardRoutesGuard() {
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
             * Authenticated but data dependencies are missing/corrupt
             * Reset session and start all-over again
            */
            dispatch(revokeAuthSession())
            return
        } else {
            // Redirect to sign-in
            return <Navigate to="/auth/sign-in" replace state={state} />;
        }
    } else {
        if (sessionState.status.disabled) {
            const suspendAccountRoute: any = (standardErrorRoutes.find((routeName) => routeName.name === 'SUSP_ACC'))?.path
            return <Navigate to={suspendAccountRoute} replace />;
        }

        const accountVerified: any = StorageServices.getLocalStorage(STORAGE_KEYS.ACC_VERIFIED)        

        if (accountVerified === '1') {
            const identityVerificationRoute: any = (
                standardErrorRoutes.find(
                    (routeName) => routeName.name === 'IDENTITY_VERF_')
            )?.path

            return <Navigate to={identityVerificationRoute} replace />;
        }
    }

    return (
        <div>
            <div className="flex h-screen">

                <Header />

                <div className="flex flex-col w-full h-screen">
                    <div className="w-full overflow-y-auto" style={CONFIG_MARGIN_TOP}>
                        <div className="kiOAkj py-4 px-2">

                            <Outlet />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
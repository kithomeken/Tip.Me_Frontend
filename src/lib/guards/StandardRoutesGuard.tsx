import { useDispatch } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { Header } from "../../components/layouts/Header"
import { standardErrorRoutes } from "../../routes/errorRoutes"
import { CONFIG_MARGIN_TOP } from "../../global/ConstantsRegistry"
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"

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
             * Redux session state is authenticated
             * but cookies are not set.
             * 
             * Reset session and start all-over again
            */

            // dispatch(revokeAuthSession())
            return
        } else {
            // Redirect to sign-in
            return <Navigate to="/auth/sign-in" replace state={state} />;
        }
    } else {
        if (sessionState.status.disabled) {
            // Suspended accounts
            const suspendAccountRoute: any = (standardErrorRoutes.find((routeName) => routeName.name === 'SUSP_ACC'))?.path
            return <Navigate to={suspendAccountRoute} replace />;
        }
    }

    return (
        <div>
            <div className="flex h-screen">
                
                <Header />

                <div className="flex flex-col w-full mb-5">
                    <div className="w-full overflow-y-auto">
                        <div className="kiOAkj" style={CONFIG_MARGIN_TOP}>

                            <Outlet />
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
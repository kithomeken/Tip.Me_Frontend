import { useDispatch } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { standardErrorRoutes } from "../../routes/errorRoutes"
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"

export default function AuthRoutesGuard() {
    const location = useLocation()
    const dispatch: any = useDispatch()
    const locationState: any = location.state

    const auth0: any = useAppSelector(state => state.auth0)
    const sessionState = Auth.checkAuthentication(auth0)

    if (sessionState.authenticated) {
        if (!sessionState.identity) {
            /* 
             * Redux session state is authenticated
             * but cookies are not set.
             * 
             * Reset session and start all-over again
            */
            // dispatch(revokeAuthSession())
            
            return 
        }
        
        if (sessionState.status.disabled) {
            const suspendAccountRoute: any = (standardErrorRoutes.find((routeName) => routeName.name === 'SUSP_ACC'))?.path
            return <Navigate to={suspendAccountRoute} replace />;
        }

        // Redirect to home or the previous location
        if (locationState === null || locationState === undefined) {
            return <Navigate to="/home" replace />;
        } else {
            return <Navigate to={locationState.from} replace />;
        }
    } else {
        if (sessionState.status.resetSession) {
            /* 
             * Redux session state is authenticated
             * but cookies are not set.
             * 
             * Reset session and start all-over again
            */

            dispatch(revokeAuthSession())
        }
    }

    return (

        <Outlet />
        
    )
}
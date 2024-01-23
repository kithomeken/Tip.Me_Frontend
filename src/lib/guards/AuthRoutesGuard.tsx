import { useDispatch } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { postAuthRoutes } from "../../routes/authRoutes"
import { standardErrorRoutes } from "../../routes/errorRoutes"
import { revokeAuthenticationAction } from "../../store/auth/revokeAuthentication"

export default function AuthRoutesGuard() {
    const dispatch: any = useDispatch()
    const location = useLocation()
    const locationState: any = location.state

    const authenticationState = useAppSelector(state => state.auth)
    const accountState = useAppSelector(state => state.account)
    const sessionState = Auth.checkAuthentication(authenticationState, accountState)

    if (sessionState.isAuthenticated) {
        if (!sessionState.accountInfoExists) {
            const currentLocation = location.pathname
            const postAuthenticationRoute: any = (postAuthRoutes.find((routeName) => routeName.name === 'ACC_CHECK_'))?.path        

            const state = {
                from: currentLocation
            }
            return <Navigate to={postAuthenticationRoute} replace state={state} />
        }
        
        if (sessionState.suspendedAccount) {
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
        if (sessionState.resetAccountSession) {
            /* 
             * Redux session state is authenticated
             * but cookies are not set.
             * 
             * Reset session and start all-over again
            */

            dispatch(revokeAuthenticationAction())
        }
    }

    return (

        <Outlet />
        
    )
}
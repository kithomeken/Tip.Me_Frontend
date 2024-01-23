import { useDispatch } from "react-redux"
import { useLocation, Navigate, Outlet } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { revokeAuthenticationAction } from "../../store/auth/revokeAuthentication"

export default function PostAuthRoutesGuard() {
    const dispatch: any = useDispatch()
    const location = useLocation()

    const authenticationState = useAppSelector(state => state.auth)
    const accountState = useAppSelector(state => state.account)
    const sessionState = Auth.checkAuthentication(authenticationState, accountState)

    console.log(sessionState);

    if (sessionState.isAuthenticated) {
        if (sessionState.accountInfoExists) {
            // Redirect to home or the previous location
            const locationState: any = location.state
            const state = {
                from: locationState?.from,
            }

            if (state.from === undefined) {
                return <Navigate to="/home" replace />;
            } else {
                return <Navigate to={state.from} replace />;
            }
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
        } else {
            // Redirect to sign-in
            return <Navigate to="/auth/sign-in" replace />;
        }
    }

    return (

        <Outlet />

    )
}
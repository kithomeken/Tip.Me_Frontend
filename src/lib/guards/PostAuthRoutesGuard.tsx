import { useDispatch } from "react-redux"
import { useLocation, Navigate, Outlet } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { revokeAuthenticationAction } from "../../store/auth/revokeAuthentication"

export default function PostAuthRoutesGuard() {
    const location = useLocation()
    const dispatch: any = useDispatch()

    const auth0: any = useAppSelector(state => state.auth0)
    const sessionState = Auth.checkAuthentication(auth0)

    if (sessionState.authenticated) {
        if (sessionState.identity) {
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
        if (sessionState.status.disabled) {
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
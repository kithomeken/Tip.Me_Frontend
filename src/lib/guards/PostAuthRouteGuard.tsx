import { useDispatch } from "react-redux"
import { useLocation, Navigate, Outlet } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"

export default function PostAuthRouteGuard() {
    const dispatch: any = useDispatch()
    const location = useLocation()
    const currentLocation = location.pathname

    const auth0: any = useAppSelector(state => state.auth0)
    const sessionState = Auth.checkAuthentication(auth0)

    const state = {
        from: currentLocation
    }

    if (auth0.sso) {
        if (sessionState.identity) {
            /* 
             * Identity is set and matches the account
            */
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
        if (sessionState.status.resetSession) {
            /* 
             * Authenticated but data dependencies are missing/corrupt
             * Reset session and start all-over again
            */
            dispatch(revokeAuthSession())
            return
        } else {
            /*
             * Not authenticated. Redirect to sign-in
            */
            return <Navigate to="/auth/sign-in" replace state={state} />;
        }
    }

    return (

        <Outlet />

    )
}
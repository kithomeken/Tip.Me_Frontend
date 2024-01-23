import React from "react"
import { useDispatch } from "react-redux"
import { Navigate, Outlet } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { revokeAuthenticationAction } from "../../store/auth/revokeAuthentication"
import { CONFIG_MARGIN_TOP } from "../../global/ConstantsRegistry"
import { Header } from "../../components/layouts/Header"

export default function ErrorRoutesGuard() {
    const dispatch: any = useDispatch()

    const authenticationState = useAppSelector(state => state.auth)
    const accountState = useAppSelector(state => state.account)
    const sessionState = Auth.checkAuthentication(authenticationState, accountState)
    
    if (!sessionState.isAuthenticated) {
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
        <div>
            <div className="flex h-screen">
                
                <Header errorMode={true} />

                <div className="flex flex-col w-full mb-5">
                    <div className="w-full overflow-y-auto">
                        <div className="kiOAkj p-2" style={CONFIG_MARGIN_TOP}>

                            <Outlet />
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
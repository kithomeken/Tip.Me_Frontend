import React from "react"

import Auth from "./Auth"
import { useDispatch } from "react-redux"
import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../store/hooks"
import { Header } from "../../components/layouts/Header"
import { standardErrorRoutes } from "../../routes/errorRoutes"
import { CONFIG_MARGIN_TOP } from "../../global/ConstantsRegistry"
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"

export const CommonRoutesGuard = () => {
    const dispatch: any = useDispatch()
    const auth0: any = useAppSelector(state => state.auth0)
    const sessionState = Auth.checkAuthentication(auth0)

    if (!sessionState.authenticated) {
        if (sessionState.status.resetSession) {
            /* 
             * Authenticated but data dependencies are missing/corrupt
             * Reset session and start all-over again
            */
            dispatch(revokeAuthSession())
            return
        } else {
            return <Navigate to="/auth/sign-in" replace />;
        }
    } else {
        if (sessionState.status.disabled) {
            const suspendAccountRoute: any = (standardErrorRoutes.find((routeName) => routeName.name === 'SUSP_ACC'))?.path
            return <Navigate to={suspendAccountRoute} replace />;
        }
    }

    return (
        <div>

            <Outlet />


            {/* <div className="flex h-screen">
                <div className="flex flex-col w-full h-screen">
                    <div className="w-full overflow-y-auto" style={CONFIG_MARGIN_TOP}>
                        <div className="kiOAkj py-4 px-2">



                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
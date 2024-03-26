import { useDispatch } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router"

import Auth from "./Auth"
import { useAppSelector } from "../../store/hooks"
import { Header } from "../../components/layouts/Header"
import { standardRoutes, standardSettingsRoutes } from "../../routes/standardRoutes"
import StorageServices from "../../services/StorageServices"
import { standardErrorRoutes } from "../../routes/errorRoutes"
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"
import { CONFIG_MARGIN_TOP, STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { Link } from "react-router-dom"
import { classNames } from "../modules/HelperFunctions"

export default function StandardSettingsRoutesGuard() {
    const location = useLocation()
    const dispatch: any = useDispatch()
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

    const settingsRoutes = (route: any) => {
        const configRoute: any = (
            standardSettingsRoutes.find(
                (routeName) => routeName.name === route)
        )?.path

        return configRoute
    }

    const routePs0t = (targetRoute: any) => {
        for (const item of standardSettingsRoutes) {
            // Check if the current item's route starts with the targetRoute
            if (item.path && targetRoute.startsWith(item.path)) {
                return item.name
            }
        }

        return null;
    }

    const Ps0tMenuLink = (menu: string, sT0: string) => {
        const Ps0t = routePs0t(location.pathname)

        return (
            <Link to={settingsRoutes(sT0)} className={classNames(
                Ps0t === sT0 ? 'text-amber-700 bg-amber-100' : 'text-slate-700 hover:bg-slate-100',
                "text-sm items-center w-full text-left py-2 px-6 rounded-md my-1"
            )}>
                <span className="flex flex-row align-middle items-center">
                    <span className="flex-auto">
                        {menu}
                    </span>
                </span>
            </Link>
        )
    }

    return (
        <div>
            <div className="flex h-screen">

                <Header />

                <div className="flex flex-col w-full h-screen">
                    <div className="w-full overflow-y-auto" style={CONFIG_MARGIN_TOP}>
                        <div className="kiOAkj">
                            <div className="w-full bg-gradient-to-r from-amber-100 to-emerald-100 h-16">
                                <div className="kiOAkj sttng_strp h-16 px-12"></div>
                            </div>

                            <div className="flex flex-col w-full md:flex-row overflow-hidden">
                                <div className="flex-shrink-0 w-full md:w-56">
                                    <div className="p-4">
                                        <h1 className="text-xl text-amber-600 font-medium tracking-wider">Settings</h1>
                                    </div>

                                    <nav className="flex flex-col px-3">
                                        {
                                            Ps0tMenuLink('Account Profile', 'CNF_ACC_ID_')
                                        }

                                        {
                                            Ps0tMenuLink('Change Email', 'CNF_EMAIL_CHNG_')
                                        }

                                        {
                                            Ps0tMenuLink('Entity', 'CNF_ENTITY_')
                                        }
                                    </nav>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-hidden py-3 h-screen -mt-32 pt-32">
                                    <main className="flex-1 h-full px-4 overflow-y-auto border-gray-200 md:border-l">
                                        <div className="container h-full mx-auto border-t md:border-t-0 pb-16">

                                            <Outlet />

                                        </div>
                                    </main>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
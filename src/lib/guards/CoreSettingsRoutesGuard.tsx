import React, { FC, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

import Auth from "./Auth";
import { useAppSelector } from "../../store/hooks";
import { ERR_500 } from "../../views/errors/ERR_500";
import HttpServices from "../../services/HttpServices";
import { ACCESS_CONTROL } from "../../api/API_Registry";
import { Loading } from "../../components/modules/Loading";
import { standardErrorRoutes } from "../../routes/errorRoutes";
import { coreSettingsRoutes } from "../../routes/configRoutes";
import { CONFIG_MAX_WIDTH, STORAGE_KEYS } from "../../global/ConstantsRegistry";
import { classNames, readDecryptAndParseLS } from "../modules/HelperFunctions";

export default function CoreSettingsRouteGuard() {
    const [state, setstate] = useState({
        status: 'pending',
        httpStatusCode: null,
    })

    const location = useLocation()
    const currentLocation = location.pathname
    const reduxAuthState = useAppSelector(state => state.auth)
    const sessionState = Auth.checkAuthentication(reduxAuthState)

    React.useEffect(() => {
        gatePassValidation()
    }, [location.pathname])

    if (!sessionState.isAuthenticated) {
        const navigationState = {
            from: currentLocation
        }

        return <Navigate to="/auth/sign-in" replace state={navigationState} />
    } else {
        if (sessionState.suspendedAccount) {
            // Suspended accounts
            const suspendAccountRoute: any = (standardErrorRoutes.find((routeName) => routeName.name === 'SUSP_ACC'))?.path
            return <Navigate to={suspendAccountRoute} replace />;
        }
    }

    const routeAuthorizationCheck = (routes: any, targetRoute: any) => {
        for (const item of routes) {
            if (Array.isArray(item.children)) {
                // If the item has children, recursively check them
                if (routeAuthorizationCheck(item.children, targetRoute)) {
                    return true;
                }
            }

            // Check if the current item's route starts with the targetRoute
            if (item.route && targetRoute.startsWith(item.route)) {
                return true;
            }
        }

        return false;
    };

    const gatePassValidation = async () => {
        let { status } = state
        let { httpStatusCode } = state
        let formData = new FormData()

        const currentRoute = coreSettingsRoutes.find(route => {
            const routePathSegments = route.path.split('/');
            const locationPathSegments = currentLocation.split('/');

            // Check if the route matches the current location (considering parameterized routes)
            return (
                routePathSegments.length === locationPathSegments.length &&
                routePathSegments.every((segment, index) =>
                    segment.startsWith(':') ? true : segment === locationPathSegments[index]
                )
            );
        });

        formData.append("axn", currentRoute.meta.action)
        formData.append("rsc", currentRoute.meta.resource)

        const response: any = await HttpServices.httpPost(ACCESS_CONTROL.CHECK_AUTHORIZATION, formData)
        httpStatusCode = response.status

        if (httpStatusCode === 200) {
            status = 'fulfilled'
        } else {
            status = 'rejected'
        }

        console.log(response);

        setstate({
            ...state, status, httpStatusCode
        })
    }


    return (
        <React.Fragment>
            <div className={classNames('flex h-screen')}>
                <div className="fixed top-0 left-0 w-full shadow-md z-10 h-16 text-emerald-800 bg-white p-4 flex justify-between items-center">
                    <div>Bespoke</div>

                    <div className="flex items-center">
                        <div className="relative">
                            <button className="flex items-center focus:outline-none">
                                <div className="mr-2">User Name</div>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                    <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zM0 10a10 10 0 0120 0 10 10 0 01-20 0z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {
                    state.status === 'rejected' ? (
                        <div className="flex flex-col w-full mb-5 mt-16">
                            <div className="w-full overflow-y-auto">
                                <div className="w-full m-auto" style={CONFIG_MAX_WIDTH}>
                                    <ERR_500 />
                                </div>
                            </div>
                        </div>
                    ) : state.status === 'fulfilled' ? (
                        <>
                            <div className="fixed top-16 left-0 h-full w-64 bg-gray-100 py-2 px-4">
                                <AccessibleMenus
                                    pathname={location.pathname}
                                />
                            </div>

                            <div className="ml-64 px-4 flex-1 mt-16">
                                <div className="kiOAkj" style={CONFIG_MAX_WIDTH}>

                                    <Outlet />

                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="px-4 py-12 flex-1 mt-16">
                            <Loading />
                        </div>
                    )
                }
            </div>
        </React.Fragment>
    )
}

interface Props {
    pathname: any,
}

const AccessibleMenus: FC<Props> = ({ pathname }) => {
    const otherMenus = readDecryptAndParseLS(STORAGE_KEYS.OTHER_MENUS)

    return (
        <React.Fragment>
            <div className="flex-none pt-2 pb-4">
                {
                    otherMenus.map((otherMenu: any, index: any) => {
                        return (
                            <div key={index}>
                                {
                                    otherMenu.children.map((child: any) => {
                                        return (
                                            <Link to={child.route} key={child.hash} className={classNames(
                                                pathname.startsWith(child.route) ? 'bg-green-600 text-white' : 'text-slate-700 hover:bg-slate-200',
                                                "text-sm items-center w-full text-left py-2 px-4 rounded block my-2"
                                            )}>
                                                <div className="flex flex-row align-middle items-center">
                                                    <span className="ml-2">
                                                        {child.label}
                                                    </span>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }

                                <hr />
                            </div>
                        )
                    })
                }
            </div>
        </React.Fragment>
    )
}

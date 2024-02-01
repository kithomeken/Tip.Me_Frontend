import { Sanctum } from "react-sanctum"
import { ToastContainer } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './assets/css/tailwind.css'
import './assets/css/beska.css'
import './assets/icons/fontawesome_pro/css/all.css'
import './assets/icons/fontawesome_6_pro/css/all.css'
import "react-toastify/dist/ReactToastify.css"

import { ERR_404 } from './views/errors/ERR_404'
import { coreSettingsRoutes } from "./routes/configRoutes"
import EncryptionKeys from "./security/EncryptionKeys"
import { standardRoutes } from './routes/standardRoutes'
import { authenticationRoutes } from './routes/authRoutes'
import { FULLY_QUALIFIED_DOMAIN_NAME } from "./api/API_Controller"
import { sanctumAxiosInstance } from "./lib/modules/HelperFunctions"
import { AUTH_SIGN_IN, AUTH_SIGN_OUT, CSRF_COOKIE_ROUTE } from "./api/API_Registry"
import { standardErrorRoutes } from "./routes/errorRoutes"
import CoreSettingsRouteGuard from "./lib/guards/CoreSettingsRoutesGuard"
import AuthRoutesGuard from "./lib/guards/AuthRoutesGuard"
import ErrorRoutesGuard from "./lib/guards/ErrorRoutesGuard"
import StandardRoutesGuard from "./lib/guards/StandardRoutesGuard"

import './firebase/firebaseConfigs'

interface RouteContextType {
    currentpage: string,
    from: string
}

const RoutingContext = React.createContext<RouteContextType>(null!)
const sanctumConfig = {
    userObjectRoute: 'api/v1/account/auth/profile',
    csrfCookieRoute: CSRF_COOKIE_ROUTE,
    signInRoute: '/api' + AUTH_SIGN_IN,
    apiUrl: FULLY_QUALIFIED_DOMAIN_NAME,
    signOutRoute: '/api' + AUTH_SIGN_OUT,
    axiosInstance: sanctumAxiosInstance()
}

/*
 * Create encryption keys 
 * if they do not exist
 */
EncryptionKeys.setEncryptionKeys()

function App() {
    const RouterProvider = ({ children }: { children: React.ReactNode }) => {
        const currentLocation = useLocation()
        const [route, setRoute] = useState({
            currentpage: currentLocation.pathname,
            from: ''
        })

        useEffect(() => {
            setRoute((prev) => ({ currentpage: currentLocation.pathname, from: prev.currentpage }))
        }, [currentLocation])

        return <RoutingContext.Provider value={route}>
            {children}
        </RoutingContext.Provider>
    }

    return (
        <Router>
            <Sanctum config={sanctumConfig}>
                <RouterProvider>
                    <ToastContainer />

                    <Routes>
                        <Route element={<AuthRoutesGuard />}>
                            {authenticationRoutes.map((route, index) => {
                                return (
                                    <Route
                                        path={route.path}
                                        element={route.element}
                                        key={index}
                                    />
                                )
                            })
                            }
                        </Route>

                        <Route element={<StandardRoutesGuard />} >
                            {
                                standardRoutes.map((route, index) => {
                                    return (
                                        <Route
                                            path={route.path}
                                            element={route.element}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </Route>

                        <Route element={<CoreSettingsRouteGuard />} >
                            {
                                coreSettingsRoutes.map((route, index) => {
                                    return (
                                        <Route
                                            path={route.path}
                                            element={route.element}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </Route>

                        <Route element={<ErrorRoutesGuard />} >
                            {
                                standardErrorRoutes.map((route, index) => {
                                    return (
                                        <Route
                                            path={route.path}
                                            element={route.element}
                                            key={index}
                                        />
                                    )
                                })
                            }
                        </Route>

                        <Route path="*" element={<ERR_404 />} />

                    </Routes>
                </RouterProvider>
            </Sanctum>
        </Router>
    )
}

export default App
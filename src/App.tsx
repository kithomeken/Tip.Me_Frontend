import { Sanctum } from "react-sanctum"
import { ToastContainer } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './assets/css/tailwind.css'
import './assets/css/beska.css'
import './assets/icons/fontawesome_pro/css/all.css'
import './assets/icons/fontawesome_6_pro/css/all.css'
import "react-toastify/dist/ReactToastify.css"

import './firebase/firebaseConfigs'
import { ERR_404 } from './views/errors/ERR_404'
import EncryptionKeys from "./security/EncryptionKeys"
import AuthRoutesGuard from './lib/guards/AuthRoutesGuard'
import { standardErrorRoutes } from "./routes/errorRoutes"
import { administrativeRoutes } from "./routes/adminRoutes"
import ErrorRoutesGuard from "./lib/guards/ErrorRoutesGuard"
import GenericRoutesGuard from "./lib/guards/GenericRoutesGuard"
import PostAuthRouteGuard from "./lib/guards/PostAuthRouteGuard"
import StandardRoutesGuard from "./lib/guards/StandardRoutesGuard"
import { CommonRoutesGuard } from "./lib/guards/CommonRoutesGuard"
import { FULLY_QUALIFIED_DOMAIN_NAME } from "./api/API_Controller"
import { sanctumAxiosInstance } from "./lib/modules/HelperFunctions"
import { commonRoutes, genericRoutes } from "./routes/genericRoutes"
import CoreSettingsRouteGuard from "./lib/guards/CoreSettingsRoutesGuard"
import { authenticationRoutes, postAuthRoutes } from './routes/authRoutes'
import { AUTH, AUTH_SIGN_OUT, CSRF_COOKIE_ROUTE } from "./api/API_Registry"
import StandardSettingsRoutesGuard from "./lib/guards/StandardSettingsRoute"
import { standardRoutes, standardSettingsRoutes } from './routes/standardRoutes'

interface RouteContextType {
    currentpage: string,
    from: string
}

const RoutingContext = React.createContext<RouteContextType>(null!)
const sanctumConfig = {
    userObjectRoute: 'api/v1/account/auth/profile',
    csrfCookieRoute: CSRF_COOKIE_ROUTE,
    signInRoute: '/api' + AUTH.FIREBASE_SSO,
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
        <Router basename='/'>
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
                        
                        <Route element={<PostAuthRouteGuard />}>
                            {postAuthRoutes.map((route, index) => {
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

                        <Route element={<StandardSettingsRoutesGuard />} >
                            {
                                standardSettingsRoutes.map((route, index) => {
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

                        <Route element={<CommonRoutesGuard />} >
                            {
                                commonRoutes.map((route, index) => {
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
                                administrativeRoutes.map((route, index) => {
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

                        <Route element={<GenericRoutesGuard />} >
                            {
                                genericRoutes.map((route, index) => {
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
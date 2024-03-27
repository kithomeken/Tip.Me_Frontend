import { EntityPayIn } from "../views/home/EntityPayIn";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Invitation } from "../views/auth/Invitation";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { PostAuthentication } from "../views/auth/PostAuthentication";
import { SignIn_Alt } from "../views/auth/SignIn_Alt";
import { SignUp_Alt } from "../views/auth/SignUp_Alt";

export const authenticationRoutes: Array<Routes_Interface> = [
    { 
        path: "/auth/sign-in", 
        element: <SignIn />, 
        caseSensitive: true, 
        name: 'AUTH_SIGN_IN' 
    },
    { 
        path: "/auth/sign-in-alt", 
        element: <SignIn_Alt />, 
        caseSensitive: true, 
        name: 'AUTH_SIGN_IN' 
    },
    { 
        path: "/auth/sign-up", 
        element: <SignUp />, 
        caseSensitive: true, 
        name: 'AUTH_SIGN_UP' 
    },
    { 
        path: "/auth/sign-up-alt", 
        element: <SignUp_Alt />, 
        caseSensitive: true, 
        name: 'AUTH_SIGN_UP' 
    },
    { 
        path: "/auth/invitation/:hash", 
        element: <Invitation />, 
        caseSensitive: true, 
        name: 'AUTH_INVITE_' 
    },
]

export const postAuthRoutes: Array<Routes_Interface> = [
    { 
        path: "/auth/_/identity/check", 
        element: <PostAuthentication />, 
        caseSensitive: true, 
        name: 'AUTH_IDENTITY_' 
    },
]
import { TipMe } from "../views/home/TipMe";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { PostAuthentication } from "../views/auth/PostAuthentication";
import { AccountActivation } from "../views/auth/AccountActivation";
import { FB_SignUpPassword } from "../views/auth/FB_SignUpPassword";

export const authenticationRoutes: Array<Routes_Interface> = [
    { path: "/auth/sign-in", element: <SignIn />, caseSensitive: true, name: 'AUTH_SIGN_IN' },
    { path: "/auth/sign-up", element: <SignUp />, caseSensitive: true, name: 'AUTH_SIGN_UP' },
    { path: "/artist/:acid", element: <TipMe />, caseSensitive: true, name: 'AUTH_SIGN_UP' },

    { path: "/firebase/auth/sign-up", element: <FB_SignUpPassword />, caseSensitive: true, name: 'AUTH_SIGN_UP' },


    
    // Account activation route
    { path: "/u/account/:uuid/email/verification/:hash", element: <AccountActivation />, activeMenu: 'N', caseSensitive: true, name: 'ACC_CHECK_' },
]

export const postAuthRoutes: Array<Routes_Interface> = [
    { path: "/auth/account/check", element: <PostAuthentication />, activeMenu: 'N', caseSensitive: true, name: 'ACC_CHECK_' },
]
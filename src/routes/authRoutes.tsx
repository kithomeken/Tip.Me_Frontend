import { TipMe } from "../views/home/TipMe";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Yeat } from "../views/home/Yeat";
import { Invitation } from "../views/auth/Invitation";
import { Routes_Interface } from "../lib/modules/routesInterface";

export const authenticationRoutes: Array<Routes_Interface> = [
    { path: "/auth/sign-in", element: <SignIn />, caseSensitive: true, name: 'AUTH_SIGN_IN' },
    { path: "/auth/sign-up", element: <SignUp />, caseSensitive: true, name: 'AUTH_SIGN_UP' },
    { path: "/auth/invitation/:hash", element: <Invitation />, caseSensitive: true, name: 'AUTH_INVITE_' },


    { path: "/artist/:acid", element: <TipMe />, caseSensitive: true, name: 'de' },

    { path: "/yeat", element: <Yeat />, caseSensitive: true, name: 'YEAT_' },
]
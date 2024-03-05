import { EntityPayIn } from "../views/home/EntityPayIn";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Yeat } from "../views/home/Yeat";
import { Invitation } from "../views/auth/Invitation";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { EmailActions } from "../views/auth/EmailActions";

export const authenticationRoutes: Array<Routes_Interface> = [
    { path: "/auth/sign-in", element: <SignIn />, caseSensitive: true, name: 'AUTH_SIGN_IN' },
    { path: "/auth/sign-up", element: <SignUp />, caseSensitive: true, name: 'AUTH_SIGN_UP' },
    { path: "/auth/post", element: <SignUp />, caseSensitive: true, name: 'AUTH_SIGN_UP' },
    { path: "/auth/invitation/:hash", element: <Invitation />, caseSensitive: true, name: 'AUTH_INVITE_' },

    { path: "_/auth/action/email", element: <EmailActions />, caseSensitive: true, name: 'EMAIL_ACTION_' },


    { path: "/entity/:uuid", element: <EntityPayIn />, caseSensitive: true, name: 'ENTITY_0_' },

    { path: "/yeat", element: <Yeat />, caseSensitive: true, name: 'YEAT_' },
]
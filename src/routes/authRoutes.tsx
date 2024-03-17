import { EntityPayIn } from "../views/home/EntityPayIn";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Invitation } from "../views/auth/Invitation";
import { Routes_Interface } from "../lib/modules/routesInterface";

export const authenticationRoutes: Array<Routes_Interface> = [
    { path: "/auth/sign-in", element: <SignIn />, caseSensitive: true, name: 'AUTH_SIGN_IN' },
    { path: "/auth/sign-up", element: <SignUp />, caseSensitive: true, name: 'AUTH_SIGN_UP' },
    { path: "/auth/post", element: <SignUp />, caseSensitive: true, name: 'AUTH_SIGN_UP' },
    { path: "/auth/invitation/:hash", element: <Invitation />, caseSensitive: true, name: 'AUTH_INVITE_' },


    { path: "/entity/:uuid", element: <EntityPayIn />, caseSensitive: true, name: 'ENTITY_0_' },

]
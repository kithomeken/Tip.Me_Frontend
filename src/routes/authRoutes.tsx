import { TipMe } from "../views/home/TipMe";
import { SignIn } from "../views/auth/SignIn";
import { SignUp } from "../views/auth/SignUp";
import { Routes_Interface } from "../lib/modules/routesInterface";

export const authenticationRoutes: Array<Routes_Interface> = [
    { path: "/auth/sign-in", element: <SignIn />, caseSensitive: true, name: 'AUTH_SIGN_IN' },
    { path: "/auth/sign-up", element: <SignUp />, caseSensitive: true, name: 'AUTH_SIGN_UP' },
    { path: "/artist/:acid", element: <TipMe />, caseSensitive: true, name: 'AUTH_SIGN_UP' },

]
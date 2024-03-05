import { EmailActions } from "../views/auth/EmailActions";
import { Routes_Interface } from "../lib/modules/routesInterface";

export const genericRoutes: Array<Routes_Interface> = [
    { path: "_/auth/action/email", element: <EmailActions />, caseSensitive: true, name: 'EMAIL_ACTION_' },
]
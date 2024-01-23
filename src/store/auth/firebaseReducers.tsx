import { AUTH_ } from "../../global/ConstantsRegistry";

const initialState = {
    processing: false,
    authenticated: false,
    error: null,
    identity: null,
}

export const firebaseAuthReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case AUTH_.RESET_:
            return {
                ...state,
                error: null,
                processing: false,
                authenticated: false,
            }

        case AUTH_.PROCESSING:
            return {
                ...state,
                error: null,
                processing: true,
                authenticated: false,
            }

        case AUTH_.FIREBASE_TOKEN:
            return {
                ...state,
                processing: true,
                authenticated: true,
            }
    
        case AUTH_.FIREBASE_EXCEPTION:
            return {
                ...state,
                processing: false,
                authenticated: false,
                error: action.response
            }
    
        case AUTH_.SANCTUM_TOKEN:
            return {
                ...state,
                processing: false,
                authenticated: true,
            }
    
        case AUTH_.SANCTUM_EXCEPTION:
            return {
                ...state,
                processing: false,
                authenticated: false,
                error: action.response
            }

        default:
            return state
    }
}
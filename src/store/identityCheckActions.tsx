import { AUTH } from "../api/API_Registry";
import { AUTH_, IDENTITY_ } from "../global/ConstantsRegistry";
import HttpServices from "../services/HttpServices";

interface IdentityProps {
    dataDump: any,
}

export function setPRc0MetaStage(propsIn: IdentityProps) {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: IDENTITY_.PRc0,
            response: IdentityProps,
        });
    }
} 

export function addIdentityToProfile(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }
                
        dispatch({
            type: IDENTITY_.PROCESSING,
            response: 'PRc0',
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump
    
            formData.append('last_name', dataDump.last_name)
            formData.append('first_name', dataDump.first_name)
    
            const identityResponse: any = await HttpServices.httpPut(AUTH.ID_META_01, formData)
            console.log(identityResponse);
            
            if (identityResponse.data.success) {
                dispatch({
                    type: AUTH_.ID_META_01,
                    response: dataDump,
                });
    
                dispatch({
                    type: IDENTITY_.PRc0_UPDATE,
                    response: 'PRc0',
                });
            } else {
                dispatch({
                    type: IDENTITY_.PRc0_EXCEPTION,
                    response: '',
                });
            }
        } catch (error) {
            dispatch({
                type: IDENTITY_.PRc0_EXCEPTION,
                response: error,
            });
        }
    }
}

export function addMSISDN_ToProfile(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: IDENTITY_.PROCESSING,
            response: {
                redirect: false,
            },
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump
    
            formData.append('msisdn', dataDump.msisdn)
    
            const identityResponse: any = await HttpServices.httpPut(AUTH.ID_META_02, formData)
            
            if (identityResponse.data.success) {
                dispatch({
                    type: AUTH_.ID_META_02,
                    response: dataDump,
                });
    
                dispatch({
                    type: IDENTITY_.PRc0_UPDATE,
                    response: 'PRc0',
                });
            } else {
                let errorMsg = identityResponse.data.msisdn[0]
                errorMsg = errorMsg.replace('msisdn', 'phone number')

                dispatch({
                    type: IDENTITY_.PRc0_EXCEPTION,
                    response: errorMsg,
                });
            }
        } catch (error) {
            dispatch({
                type: IDENTITY_.PRc0_EXCEPTION,
                response: error,
            });
        }
    }
}

export function artistEntityCreation(propsIn: IdentityProps) {
    return async (dispatch: (arg0: { type: string; response: any }) => void) => {
        const IdentityProps = { ...propsIn }

        dispatch({
            type: IDENTITY_.PROCESSING,
            response: {
                redirect: false,
            },
        });

        try {
            let formData = new FormData()
            const dataDump = IdentityProps.dataDump
    
            formData.append('artist', dataDump.artist)
            formData.append('type', dataDump.type)
            formData.append('entity', dataDump.entity)
    
            const identityResponse: any = await HttpServices.httpPost(AUTH.ID_META_03, formData)            

            if (identityResponse.data.success) {
                dispatch({
                    type: AUTH_.ID_META_03,
                    response: identityResponse.data.payload,
                });
                    
                dispatch({
                    type: IDENTITY_.PRc0_COMPLETED,
                    response: identityResponse.data.payload,
                });
            } else {
                dispatch({
                    type: IDENTITY_.PRc0_EXCEPTION,
                    response: identityResponse.data,
                });
            }
        } catch (error) {
            dispatch({
                type: IDENTITY_.PRc0_EXCEPTION,
                response: error,
            });
        }
    }
}

export function resetIdentity() {
    return (dispatch: (arg0: { type: string; response: any }) => void) => {
        dispatch({
            type: IDENTITY_.RESET_,
            response: {
                redirect: false,
            },
        });
    }
}


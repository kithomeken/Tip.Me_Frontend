import { ACCOUNT } from "../../api/API_Registry";
import AxiosServices from "../../services/AxiosServices";
import { POST_AUTH } from "../../global/ConstantsRegistry";

export const postAuthActions = () => {
    return async (dispatch: (argo: { type: string, response: any }) => void) => {
        dispatch({
            type: POST_AUTH.FETCHING_DATA,
            response: null,
        });

        // Fetch account profile data
        fetchProfileData(dispatch)

        dispatch({
            type: POST_AUTH.FETCHING_DATA,
            response: null,
        });
    }
}

const fetchProfileData = async (dispatch: any) => {
    try {
        const profileResponse: any = await AxiosServices.fetchData(ACCOUNT.PROFILE)

        if (profileResponse.data.success) {
            dispatch({
                type: POST_AUTH.FETCHED_PROFILE_DATA,
                response: profileResponse.data.payload,
            });
        } else {
            dispatch({
                type: POST_AUTH.PROFILE_DATA_EXCEPTION,
                response: null,
            });
        }
    } catch (error) {
        dispatch({
            type: POST_AUTH.PROFILE_DATA_EXCEPTION,
            response: null,
        });
    }
}


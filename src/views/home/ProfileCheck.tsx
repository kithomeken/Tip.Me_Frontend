import React from "react"
import { Helmet } from "react-helmet"
import { useDispatch } from "react-redux"

import { Identity_00 } from "./Identity_00"
import { Identity_03 } from "./Identity_03"
import { Identity_02 } from "./Identity_02"
import { Identity_01 } from "./Identity_01"
import { useAppSelector } from "../../store/hooks"
import { resetIdentity } from "../../store/identityCheckActions"
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"

export const ProfileCheck = () => {
    React.useEffect(() => {
        dispatch(resetIdentity())
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)

    return (
        <React.Fragment>
            <Helmet>
                <title>Account Details</title>
            </Helmet>

            <div className="w-full">
                <div className={`w-full mb-3`}>
                    <div className="kiOAkj p-6" style={CONFIG_MAX_WIDTH}>
                        {
                            idC_State.PRc0 !== 'META_00' ? (
                                <span className="text-amber-600 mb-2 py-2 text-2xl block">
                                    Complete Your Profile
                                </span>
                            ) : null
                        }

                        {
                            idC_State.PRc0 === 'META_01' ? (
                                <Identity_01 />
                            ) : idC_State.PRc0 === 'META_02' ? (
                                <Identity_02 />
                            ) : idC_State.PRc0 === 'META_03' ? (
                                <Identity_03 />
                            ) : (
                                <Identity_00 />
                            )
                        }

                        <div className="mx-auto py-3 text-center">
                            <p className="text-sm py-2">
                                © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-amber-600 block">Tip by Tip.</span>
                            </p>
                        </div>
                    </div>
                </div >
            </div >
        </React.Fragment >
    )
}
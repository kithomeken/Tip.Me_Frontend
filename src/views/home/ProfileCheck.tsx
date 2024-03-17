import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { Identity_00 } from "./Identity_00"
import { Identity_03 } from "./Identity_03"
import { Identity_02 } from "./Identity_02"
import { Identity_01 } from "./Identity_01"
import { AUTH } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import { resetIdentity, setPRc0MetaStage } from "../../store/identityCheckActions"

export const ProfileCheck = () => {
    const [state, setstate] = useState({
        httpStatus: 200,
        status: 'pending',
    })

    React.useEffect(() => {
        identityProcessStateCheck()
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)

    const identityProcessStateCheck = async () => {
        let { status } = state
        let { httpStatus } = state
        dispatch(resetIdentity())

        try {
            const metaCheckResp: any = await HttpServices.httpGet(AUTH.META_CHECK)
            httpStatus = metaCheckResp.status

            if (metaCheckResp.data.success) {
                const PRc0 = metaCheckResp.data.payload.PRc0

                const metaCheckProps = {
                    dataDump: {
                        PRc0: PRc0,
                    }
                }

                dispatch(setPRc0MetaStage(metaCheckProps))
                status = 'fulfilled'
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.error(error);
            status = 'rejected'
            httpStatus = 500
        }

        setstate({
            ...state, status, httpStatus
        })
    }

    const loadIdentityModules = (tab: string = 'in') => {
        switch (tab) {
            case "META_00":
                return <Identity_00 />

            case "META_01":
                return <Identity_01 />

            case "META_02":
                return <Identity_02 />

            case "META_03":
                return <Identity_03 />

            default:
                return <Identity_00 />
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Identity Onboarding</title>
            </Helmet>

            <div className="w-full">
                <div className={`w-full mb-3`}>
                    <div className="kiOAkj py-3 px-3" style={CONFIG_MAX_WIDTH}>
                        {
                            state.status === 'rejected' ? (
                                <div className="py-3 px-4 w-full h-screen">
                                    <div className="flex items-center justify-center">
                                        {
                                            state.httpStatus === 404 ? (
                                                <ERR_404
                                                    compact={true}
                                                />
                                            ) : (
                                                <ERR_500 />
                                            )
                                        }
                                    </div>
                                </div>
                            ) : state.status === 'fulfilled' ? (
                                <>
                                    {
                                        idC_State.PRc0 !== 'META_00' ? (
                                            <span className="text-amber-600 mb-2 py-2 text-2xl block">
                                                Complete Your Profile
                                            </span>
                                        ) : null
                                    }

                                    <div className="w-full">
                                        {loadIdentityModules(idC_State.PRc0)}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-screen -mt-20 flex flex-col justify-center align-middle items-center mx-4">
                                    <Loading />
                                </div>
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
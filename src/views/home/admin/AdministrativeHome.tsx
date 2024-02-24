import React, { useState } from "react"

import { Empty } from "../../errors/Empty"
import { Link } from "react-router-dom"
import ReactTable from "../../../lib/hooks/ReactTable"
import HttpServices from "../../../services/HttpServices"
import { ADMINISTRATION } from "../../../api/API_Registry"
import { Loading } from "../../../components/modules/Loading"
import { standardRoutes } from "../../../routes/standardRoutes"
import { CONFIG_MAX_WIDTH } from "../../../global/ConstantsRegistry"
import { API_RouteReplace, humanReadableDate } from "../../../lib/modules/HelperFunctions"
import { RequestDetails } from "./RequestDetails"

export const AdminstrativeHome = () => {
    const [state, setstate] = useState({
        uuid: null,
        status: 'pending',
        data: {
            pending: null,
        },
        show: {
            requestPanel: false,
        }
    })

    React.useEffect(() => {
        pendingOnboardingRequests()
    }, [])

    const showOrHideRequestDetailsPanel = () => {
        let {show} = state
        show.requestPanel = !state.show.requestPanel

        setstate({
            ...state, show
        })
    }

    const pendingOnboardingRequests = async () => {
        let { data } = state
        let { status } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.PENDING_REQUETS)

            if (response.data.success) {
                data.pending = response.data.payload.requests
                status = 'fulfilled'
            } else {
                status = 'rejected'
            }

            setstate({
                ...state, status, data
            })
        } catch (error) {
            status = 'rejected'

            setstate({
                ...state, status, data
            })
        }
    }

    const viewPendingRequestRoute = (standardRoutes.find((routeName: { name: string }) => routeName.name === 'PENDING_DETAILS_'))?.path

    const columns = React.useMemo(
        () => [
            {
                Header: 'Artist(s)',
                id: 'cl74wb4y7',
                accessor: (data: { name: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="block text-slate-800 text-sm py-1">
                            {data.name}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Type',
                id: 'cle22tk3i',
                accessor: (data: { type: any }) => (
                    <span>
                        <span className="block mb-0 text-sm capitalize">
                            {data.type}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Request Date',
                id: 'jhfbcinsakdnwq',
                accessor: (data: { created_at: any }) => (
                    <span className="block mb-0 text-sm">
                        {humanReadableDate(data.created_at)}
                    </span>
                )
            },
            {
                Header: '-',
                id: 'ihbs87rvhb3298',
                accessor: (data: { x_uuid: any }) => (
                    <button onClick={showOrHideRequestDetailsPanel} type="button" className="text-amber-600 m-auto hover:underline text-right float-right cursor-pointer hover:text-amber-900 text-xs">
                        View
                    </button>
                )
            },
        ],
        []
    )



    return (
        <React.Fragment>
            <div className="w-full p-4">
                {
                    state.status === 'rejected' ? (
                        <>

                        </>
                    ) : state.status === 'fulfilled' ? (
                        <div className="w-full">
                            <div className={`w-full mb-3`}>
                                <div className="kiOAkj" style={CONFIG_MAX_WIDTH}>
                                    <div className="flex mb-4 items-center">
                                        <p className="text-2xl flex-auto text-amber-600">
                                            Onboarding Requests
                                        </p>
                                    </div>

                                    <div className="flex mb-4 w-full">
                                        {
                                            state.data.pending.length < 1 ? (
                                                <Empty description={'You do not have any onboarding requests at the moment'} />
                                            ) : (
                                                <div className="w-full">
                                                    <ReactTable columns={columns} data={state.data.pending} />
                                                </div>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center">
                            <div className="flex-grow">
                                <Loading />
                            </div>
                        </div>
                    )
                }
            </div>

            <RequestDetails
                show={state.show.requestPanel}
                showOrHide={showOrHideRequestDetailsPanel}
            />
        </React.Fragment>
    )
}
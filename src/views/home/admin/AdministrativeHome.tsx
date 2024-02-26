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

    const showOrHideRequestDetailsPanel = (uuidX: string) => {
        let { show } = state
        let { uuid } = state

        show.requestPanel = !state.show.requestPanel
        uuid = uuidX

        setstate({
            ...state, show, uuid
        })
    }

    const pendingOnboardingRequests = async () => {
        let { data } = state
        let { status } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.ALL_REQUETS)

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
                Header: 'Status',
                id: 'n9YpE3zK0q',
                accessor: (data: { status: any }) => (
                    <span>
                        {
                            data.status === 'A' ? (
                                <span className="bg-green-200 text-emerald-700 text-xs py-1 px-2 rounded-md">
                                    <span className="hidden md:inline-block">Approved</span>
                                    <span className="md:hidden">Approved</span>
                                </span>
                            ) : data.status === 'P' ? (
                                <span className="bg-sky-200 text-sky-700 text-xs py-1 px-2 rounded-md">
                                    <span className="hidden md:inline-block">New Request</span>
                                    <span className="md:hidden">New</span>
                                </span>
                            ) : (
                                <span className="bg-red-200 text-red-500 text-xs py-1 px-1.5 rounded">
                                    <span className="hidden md:inline-block">Rejected</span>
                                    <span className="md:hidden">Rejected</span>
                                </span>
                            )
                        }
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
                accessor: (data: { uuid: any }) => (
                    <span onClick={() => showOrHideRequestDetailsPanel(data.uuid)} className="text-amber-600 m-auto hover:underline text-right block float-right cursor-pointer hover:text-amber-900 text-xs">
                        View
                    </span>
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
                uuid={state.uuid}
                show={state.show.requestPanel}
                showOrHide={showOrHideRequestDetailsPanel}
            />
        </React.Fragment>
    )
}
import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { RequestDetails } from "./RequestDetails"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { ADMINISTRATION } from "../../api/API_Registry"
import { Loading } from "../../components/modules/Loading"
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import { formatAmount, humanReadableDate } from "../../lib/modules/HelperFunctions"
import { PaymentDetails } from "./PaymentDetails"

export const AdminstrativeHome = () => {
    const [state, setstate] = useState({
        uuid: null,
        status: 'pending',
        statusMode: {
            payments: 'fulfilled',
        },
        data: {
            payments: null,
            onboarding: null,
            exceptions: null,
        },
        show: {
            requestPanel: false,
            paymentPanel: false,
        },
    })

    React.useEffect(() => {
        fetchOnboardingRequests()
        // fetchPaymentRequests()
    }, [])

    const showOrHideRequestDetailsPanel = (uuidX: string) => {
        let { show } = state
        let { uuid } = state
        let { status } = state

        show.requestPanel = !state.show.requestPanel
        uuid = uuidX
        status = 'fulfilled'

        setstate({
            ...state, show, uuid, status
        })
    }

    const showOrHidePaymentDetailsPanel = (uuidX: string) => {
        let { show } = state
        let { uuid } = state
        let { status } = state

        show.paymentPanel = !state.show.paymentPanel
        uuid = uuidX
        status = 'fulfilled'

        setstate({
            ...state, show, uuid, status
        })
    }

    const fetchOnboardingRequests = async () => {
        let { data } = state
        let { status } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.ALL_REQUETS)
            const response2: any = await HttpServices.httpGet(ADMINISTRATION.ALL_PAYMENTS)
            const mpesaXceptions: any = await HttpServices.httpGet(ADMINISTRATION.MPESA_EXCEPTIONS)

            if (response.data.success) {
                data.onboarding = response.data.payload.requests
                data.payments = response2.data.payload.payments
                data.exceptions = mpesaXceptions.data.payload.exceptions

                Object.keys(data.payments).forEach(function (key) {
                    data.payments[key].gross = formatAmount(parseFloat(data.payments[key].gross))
                    data.payments[key].amount_payable = formatAmount(parseFloat(data.payments[key].amount_payable))
                })

                status = 'fulfilled'
            } else {
                status = 'rejected'
            }

            // fetchPaymentRequests()
        } catch (error) {
            status = 'rejected'
        }

        setstate({
            ...state, status, data
        })

    }

    const fetchPaymentRequests = async () => {
        let { data } = state
        let { statusMode } = state

        try {
            const response: any = await HttpServices.httpGet(ADMINISTRATION.ALL_PAYMENTS)

            if (response.data.success) {
                data.payments = response.data.payload.payments

                Object.keys(data.payments).forEach(function (key) {
                    data.payments[key].gross = formatAmount(parseFloat(data.payments[key].gross))
                    data.payments[key].amount_payable = formatAmount(parseFloat(data.payments[key].amount_payable))
                })

                statusMode.payments = 'fulfilled'
            } else {
                statusMode.payments = 'rejected'
            }
        } catch (error) {
            statusMode.payments = 'rejected'
        }

        setstate({
            ...state, statusMode, data
        })
    }

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

    const paymentColumns = React.useMemo(
        () => [
            {
                Header: 'Amount',
                id: 'sQ4eR8zT3j',
                accessor: (data: { gross: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="pc-1 px-1.5 text-lg">
                            <span className="text-stone-700">{data.gross.split('.')[0]}</span>
                            <span className="text-stone-400">.{data.gross.split('.')[1]}</span>
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Status',
                id: 'g8F7A1kH5l',
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
                Header: 'Artist(s)',
                id: 'oL2hX0Dp3R',
                accessor: (data: { name: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="block text-slate-800 text-sm py-1">
                            {data.name}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Account',
                id: 'tU6dM1rH2x',
                accessor: (data: { account: any }) => (
                    <span>
                        <span className="block mb-0 text-sm capitalize">
                            {data.account}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Request Date',
                id: 'fJ7iS2oE4n',
                accessor: (data: { created_at: any }) => (
                    <span className="block mb-0 text-sm">
                        {humanReadableDate(data.created_at)}
                    </span>
                )
            },
            {
                Header: '-',
                id: 'cK1aV8pB9o',
                accessor: (data: { uuid: any }) => (
                    <span onClick={() => showOrHidePaymentDetailsPanel(data.uuid)} className="text-amber-600 m-auto hover:underline text-right block float-right cursor-pointer hover:text-amber-900 text-xs">
                        View
                    </span>
                )
            },
        ],
        []
    )

    const exceptionsColumns = React.useMemo(
        () => [
            {
                Header: 'Module',
                id: 'Xy5RvKs3',
                accessor: (data: { module: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="block text-slate-800 text-sm py-1">
                            {data.module}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Error Code',
                id: '6pAqW8tC',
                accessor: (data: { error_code: any, error_message: any }) => (
                    <span className="flex flex-col py-0.5">
                        <span className="block text-slate-700 text-sm">
                            {data.error_code}
                        </span>

                        <span className="block text-stone-500 text-sm">
                            {data.error_message}
                        </span>
                    </span>
                ),
            },
            {
                Header: '-',
                id: '1sC5wX8i',
                accessor: (data: { reference: any }) => (
                    <span onClick={() => showOrHidePaymentDetailsPanel(data.reference)} className="text-amber-600 m-auto hover:underline text-right block float-right cursor-pointer hover:text-amber-900 text-xs">
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
                                <div className="kiOAkj py-3" style={CONFIG_MAX_WIDTH}>
                                    <div className="flex mb-4 items-center">
                                        <p className="text-2xl flex-auto text-stone-600">
                                            Onboarding Requests
                                        </p>
                                    </div>

                                    <div className="flex mb-4 w-full">
                                        {
                                            state.data.onboarding.length < 1 ? (
                                                <Empty description={'You do not have any onboarding requests at the moment'} />
                                            ) : (
                                                <div className="w-full">
                                                    <ReactTable columns={columns} data={state.data.onboarding} />
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className="flex mb-4 items-center">
                                        <p className="text-2xl flex-auto text-stone-600">
                                            Payment Requests
                                        </p>
                                    </div>

                                    <div className="flex mb-4 w-full">
                                        {
                                            state.statusMode.payments === 'rejected' ? (
                                                <></>
                                            ) : state.statusMode.payments === 'fulfilled' ? (
                                                state.data.payments.length < 1 ? (
                                                    <Empty description={'You do not have any payment requests at the moment'} />
                                                ) : (
                                                    <div className="w-full">
                                                        <ReactTable columns={paymentColumns} data={state.data.payments} />
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-full h-full flex flex-col justify-center">
                                                    <div className="flex-grow">
                                                        <Loading />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className="flex mb-4 items-center">
                                        <p className="text-2xl flex-auto text-stone-600">
                                            Mpesa Exceptions
                                        </p>
                                    </div>

                                    <div className="flex mb-4 w-full">
                                        {
                                            state.statusMode.payments === 'rejected' ? (
                                                <></>
                                            ) : state.statusMode.payments === 'fulfilled' ? (
                                                state.data.exceptions.length < 1 ? (
                                                    <Empty description={'You do not have any payment requests at the moment'} />
                                                ) : (
                                                    <div className="w-full">
                                                        <ReactTable columns={exceptionsColumns} data={state.data.exceptions} />
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-full h-full flex flex-col justify-center">
                                                    <div className="flex-grow">
                                                        <Loading />
                                                    </div>
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

            <PaymentDetails
                uuid={state.uuid}
                show={state.show.paymentPanel}
                showOrHide={showOrHidePaymentDetailsPanel}
            />
        </React.Fragment>
    )
}
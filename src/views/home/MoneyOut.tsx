import React, { useState } from "react"

import { ACCOUNT } from "../../api/API_Registry"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { API_RouteReplace, formatAmount, humanReadableDate } from "../../lib/modules/HelperFunctions"
import { Empty } from "../errors/Empty"

export const MoneyOut = ({ account }: { account: string }) => {
    const [state, setstate] = useState({
        posting: false,
        status: 'pending',
        data: {
            requests: null,
            money_out: null,
        }
    })

    React.useEffect(() => {
        moneyOutTransactions()
    }, [])

    const moneyOutTransactions = async () => {
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.MONEY_OUT_TRANSACTIONS)

            if (response.data.success) {
                status = 'fulfilled'
                data.requests = response.data.payload.requests
                data.money_out = response.data.payload.out

                Object.keys(data.money_out).forEach(function (key) {
                    data.money_out[key].amount = formatAmount(parseFloat(data.money_out[key].amount))
                })

                Object.keys(data.requests).forEach(function (key) {
                    data.requests[key].gross = formatAmount(parseFloat(data.requests[key].gross))
                })
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'fulfilled'
            console.log(error);
        }

        setstate({
            ...state, data, status
        })
    }

    const approvePendingRequest = async () => {
        let { data } = state
        let { posting } = state

        if (!posting) {
            posting = true

            setstate({
                ...state, posting
            })

            try {
                const requestApprovalRoute = API_RouteReplace(ACCOUNT.REQUEST_APPROVAL, ':request', data.requests.r_uuid)
                const approvalResponse = await HttpServices.httpPost(requestApprovalRoute, null)

                if (approvalResponse) {

                } else {

                }

                posting = false
            } catch (error) {
                posting = false
            }

            setstate({
                ...state, posting
            })
        }
    }

    const declinePendingRequest = async () => {
        let { posting } = state

        if (!posting) {
            try {

            } catch (error) {

            }
        }
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Pending',
                id: 'TRC_R001',
                accessor: (data: any) => (
                    data.a_uuid ? (
                        <div className="px-0 w-full">
                            <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-4 pt-2">
                                <div className="w-full flex-grow flex flex-col md:pr-3 align-middle gap-y-3 md:pl-4 md:basis-1/2">
                                    <div className="w-full flex flex-row md:pr-3 align-middle items-center gap-x-3 md:pl-4 md:basis-1/2">
                                        <div className="basis-1/2">
                                            <span className=" py-0 px-1.5 text-stone-500 text-xs">
                                                Ksh.
                                            </span>

                                            <span className="py- px-1.5 text-2xl">
                                                <span className="text-stone-700">{data.gross.split('.')[0]}</span>
                                                <span className="text-stone-400">.{data.gross.split('.')[1]}</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/2">
                                            <span className="block mb-0 text-sm text-slate-500 basis-1/2 text-right md:">
                                                {humanReadableDate(data.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full md:block hidden flex-row align-middle items-center md:pl-3 md:basis-1/2">
                                        <div className="basis-1/2">
                                            <div className="basis-1/2">
                                                {
                                                    data.status === 'N' ? (
                                                        <span className="inline-flex items-center mr-2 rounded-md bg-orange-100 px-3 text-sm text-orange-600 ring-1 ring-inset ring-orange-500/20">
                                                            Pending your approval
                                                        </span>
                                                    ) : data.status === 'Y' ? (
                                                        <span className="inline-flex items-center mr-2 rounded bg-emerald-100 px-3 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                                            Approved
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center mr-2 rounded bg-red-100 px-3 text-sm text-red-600 ring-1 ring-inset ring-red-500/10">
                                                            Rejected
                                                        </span>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex-row align-middle hidden md:block px-3 items-center">
                                        {
                                            data.status === 'N' ? (
                                                <div className="w-full flex flex-row gap-x-4 pt-1 align-middle items-center">
                                                    <div className="basis-1/2">
                                                        <button type="button" className="text-green-600 w-full py-2 px-4 text-sm flex flex-row border border-green-600 items-center justify-center text-center rounded-md bg-white hover:bg-green-200 focus:outline-none">
                                                            <i className="fa-duotone fa-badge-check mr-2 fa-lg"></i>
                                                            Approve
                                                        </button>
                                                    </div>

                                                    <div className="basis-1/2">
                                                        <button type="button" className="text-red-600 w-full py-2 px-4 text-sm flex flex-row border border-red-600 items-center justify-center text-center rounded-md bg-white hover:bg-red-200 focus:outline-none">
                                                            <i className="fa-duotone fa-ban mr-2 fa-lg"></i>
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : data.status === 'Y' ? (
                                                <>
                                                    edeouje
                                                </>
                                            ) : (
                                                <>
                                                    wdok
                                                </>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="w-full md:hidden flex flex-row align-middle items-center md:pl-3 md:basis-1/2">
                                    <div className="basis-1/2">
                                        <div className="basis-1/2">
                                            {
                                                data.status === 'N' ? (
                                                    <span className="inline-flex items-center mr-2 rounded-md bg-orange-100 px-3 text-sm text-orange-600 ring-1 ring-inset ring-orange-500/20">
                                                        Pending your approval
                                                    </span>
                                                ) : data.status === 'Y' ? (
                                                    <span className="inline-flex items-center mr-2 rounded bg-emerald-100 px-3 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center mr-2 rounded bg-red-100 px-3 text-sm text-red-600 ring-1 ring-inset ring-red-500/10">
                                                        Rejected
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="py-3 px-3 md:basis-1/2 w-full border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="flex flex-row w-full align-middle items-center">
                                        <div className="basis-2/3 text-stone-500 text-sm">
                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Amount to Receive:</span>
                                                <span className="md:hidden">You'll Receive:</span>
                                            </span>

                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Processing Fee ({data.comm_rate}%):</span>
                                                <span className="md:hidden">Processing Fee ({data.comm_rate}%):</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/3 text-stone-600 text-right">
                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.amount_payable))}
                                            </span>

                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.comm_amount))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-y-4 pt-4">
                                {
                                    data.status === 'N' ? (
                                        <div className="w-full flex flex-row md:pr-3 gap-x-4 mb-4 align-middle items-center md:basis-1/2">
                                            <div className="basis-1/2">
                                                <button type="button" className="text-green-600 w-full py-2 px-4 sm:hidden text-sm flex flex-row border border-green-600 items-center justify-center text-center rounded-md bg-white hover:bg-green-200 focus:outline-none">
                                                    <i className="fa-duotone fa-badge-check mr-2 fa-lg"></i>
                                                    Approve
                                                </button>
                                            </div>

                                            <div className="basis-1/2">
                                                <button type="button" className="text-red-600 w-full py-2 px-4 sm:hidden text-sm flex flex-row border border-red-600 items-center justify-center text-center rounded-md bg-white hover:bg-red-200 focus:outline-none">
                                                    <i className="fa-duotone fa-ban mr-2 fa-lg"></i>
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ) : data.status === 'Y' ? (
                                        <></>
                                    ) : (
                                        <>

                                        </>
                                    )
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="px-0 w-full">
                            <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-4 pt-2">
                                <div className="w-full flex-grow flex flex-col md:pr-3 align-middle gap-y-3 md:pl-4 md:basis-1/2">
                                    <div className="w-full flex flex-row align-middle items-center gap-x-3 md:px-3 md:basis-1/2">
                                        <div className="basis-1/2">
                                            <span className=" py-0 px-1.5 text-stone-500 text-xs">
                                                Ksh.
                                            </span>

                                            <span className="py- px-1.5 text-2xl">
                                                <span className="text-stone-700">{data.gross.split('.')[0]}</span>
                                                <span className="text-stone-400">.{data.gross.split('.')[1]}</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/2">
                                            <span className="block mb-0 text-sm text-slate-500 basis-1/2 text-right md:">
                                                {humanReadableDate(data.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full md:flex hidden flex-row align-middle gap-x-3 items-center md:px-3 md:basis-1/2">
                                        <div className="basis-1/2">
                                            {
                                                data.status === 'N' ? (
                                                    <span className="inline-flex items-center mr-2 rounded bg-orange-100 px-3 text-sm text-orange-600 ring-1 ring-inset ring-orange-500/20">
                                                        Pending
                                                    </span>
                                                ) : data.status === 'Y' ? (
                                                    <span className="inline-flex items-center mr-2 rounded bg-emerald-100 px-3 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center mr-2 rounded bg-red-100 px-3 text-sm text-red-600 ring-1 ring-inset ring-red-500/10">
                                                        Rejected
                                                    </span>
                                                )
                                            }
                                        </div>

                                        <div className="basis-1/2">
                                            <span className="ml-3 text-sm text-orange-500">
                                                {data.meta.app}/{data.meta.all} members approved
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:hidden flex flex-row align-middle items-center md:pl-3 md:basis-1/2">
                                    <div className="basis-1/2">
                                        {
                                            data.status === 'N' ? (
                                                <span className="inline-flex items-center mr-2 rounded bg-orange-100 px-3 text-sm text-orange-600 ring-1 ring-inset ring-orange-500/20">
                                                    Pending
                                                </span>
                                            ) : data.status === 'Y' ? (
                                                <span className="inline-flex items-center mr-2 rounded bg-emerald-100 px-3 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center mr-2 rounded bg-red-100 px-3 text-sm text-red-600 ring-1 ring-inset ring-red-500/10">
                                                    Rejected
                                                </span>
                                            )
                                        }
                                    </div>

                                    <div className="basis-1/2">
                                        <span className="ml-3 text-sm text-orange-500">
                                            {data.meta.app}/{data.meta.all} members approved
                                        </span>
                                    </div>
                                </div>

                                <div className="py-3 px-3 md:basis-1/2 w-full border-2 mb-3 border-gray-300 border-dashed rounded-md">
                                    <div className="flex flex-row w-full align-middle items-center">
                                        <div className="basis-2/3 text-stone-500 text-sm">
                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Amount to Receive:</span>
                                                <span className="md:hidden">You'll Receive:</span>
                                            </span>

                                            <span className=" py-1 block mb-2">
                                                <span className="hidden md:inline-block">Processing Fee ({data.comm_rate}%):</span>
                                                <span className="md:hidden">Processing Fee ({data.comm_rate}%):</span>
                                            </span>
                                        </div>

                                        <div className="basis-1/3 text-stone-600 text-right">
                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.amount_payable))}
                                            </span>

                                            <span className=" py-1 block mb-2 capitalize">
                                                {formatAmount(parseFloat(data.comm_amount))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                ),
            },
        ],
        []
    )

    const fulfilledTransactions = React.useMemo(
        () => [
            {
                Header: 'Paid Out',
                id: 'FXd-Wc00',
                accessor: (data: any) => (
                    <div className="px-0 w-full">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full flex flex-row md:pr-3 align-middle items-center pb-2 md:py-0.5 md:basis-1/2">
                                <span className=" py-1 px-1.5 text-stone-500 text-xs">
                                    Ksh.
                                </span>

                                <span className=" py-1 px-1.5 text-2xl">
                                    <span className="text-stone-700">{data.amount.split('.')[0]}</span>
                                    <span className="text-stone-400">.{data.amount.split('.')[1]}</span>
                                </span>

                                <span className="block mb-0 text-sm text-slate-500 basis-1/2 text-right md:hidden">
                                    {humanReadableDate(data.tran_date)}
                                </span>
                            </div>

                            <div className="w-full flex flex-row align-middle items-center md:pl-3 md:py-1 md:basis-1/2">
                                <div className="flex flex-row align-middle items-center w-full">
                                    <div className="basis-1/2">
                                        <span className="inline-flex items-center text-sm font-medium text-amber-600">
                                            <span className="text-amber-600 mr-2 pr-2 md:mr-4 md:pr-4 border-r">
                                                {data.receipt}
                                            </span>

                                            <span className="text-stone-600">
                                                {data.msisdn}
                                            </span>

                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span className="md:block mb-0 text-sm text-slate-500 basis-1/2 text-start hidden px-1.5">
                            {humanReadableDate(data.tran_date)}
                        </span>
                    </div>
                ),
            },
        ],
        []
    )

    return (
        <React.Fragment>
            {
                state.status === 'rejected' ? (
                    null
                ) : state.status === 'fulfilled' ? (
                    <div className="py-4">
                        <h2 className="text-lg leading-7 text-amber-600 sm:text-lg sm: mb-2">
                            Withdrawal Request
                        </h2>

                        <div className="w-12/12">
                            <p className="text-sm form-group text-gray-500">
                                Withdrawals requests to move money from your wallet
                            </p>
                        </div>


                        {
                            state.data.requests.length < 1 ? (
                                <div className="py-2 mb-3">
                                    <div className="flex m-auto w-full md:w-1/2 flex-col md:flex-row md:space-x-4 justify-center px-6 py-4 border-2 border-stone-300 border-dashed rounded-md">
                                        <div className="space-y-6 text-center">
                                            <div className="text-sm w-full text-stone-600">
                                                <p className="pb-3 text-lg">
                                                    No pending withdrawal requests found
                                                </p>
                                                <p className="text-sm text-gray-500 pb-1">
                                                    Consider making a withdrawal today to access your hard-earned funds.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <ReactTable columns={columns} data={state.data.requests} />
                                </div>
                            )
                        }

                        <div className="w-12/12">
                            <p className="text-sm form-group text-gray-500">
                                Paid out withdrawal requets
                            </p>
                        </div>

                        <div className="w-full">
                            {
                                state.data.money_out.length < 1 ? (
                                    <div className="py-4">
                                        <Empty title="No withdrawal transactions found" description={""} />
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <ReactTable columns={fulfilledTransactions} data={state.data.money_out} />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className="py-4">
                        <Loading />
                    </div>
                )
            }
        </React.Fragment>
    )
}
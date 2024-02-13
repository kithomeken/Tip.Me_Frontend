import React, { useState } from "react"

import { ACCOUNT } from "../../api/API_Registry"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { API_RouteReplace, formatAmount, humanReadableDate } from "../../lib/modules/HelperFunctions"
import { Empty } from "../errors/Empty"

export const MoneyOut = ({ account }: { account: string }) => {
    const [state, setstate] = useState({
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



    const columns = React.useMemo(
        () => [
            {
                Header: '',
                id: 'TRC_R001',
                accessor: (data: any) => (
                    <div className="px- py-2">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full flex flex-row md:border-r align-middle items-center pb-5 md:py-1 md:basis-1/3">
                                <span className=" py-1 px-1.5 text-stone-500 text-xs">
                                    Ksh.
                                </span>

                                <span className=" py-1 px-1.5 text-3xl">
                                    <span className="text-stone-700">{formatAmount(parseFloat(data.amount))}</span>
                                </span>
                            </div>

                            <div className="w-full max-w-screen-sm md:basis-2/3 md:pl-4">
                                <div className="flex flex-row align-middle items-center w-full">
                                    <div className="basis-1/2">
                                        {
                                            data.status === 'N' ? (
                                                <span className="inline-flex items-center mr-2 rounded-lg bg-amber-100 px-3 text-sm font-medium text-amber-600 ring-1 ring-inset ring-amber-500/20">
                                                    Pending
                                                </span>
                                            ) : data.status === 'Y' ? (
                                                <span className="inline-flex items-center mr-2 rounded-lg bg-emerald-100 px-3 text-sm font-medium text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center mr-2 rounded-lg bg-red-100 px-3 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/10">
                                                    Rejected
                                                </span>
                                            )
                                        }
                                    </div>

                                    <span className="block mb-0 text-sm text-slate-500 basis-1/2 text-right">
                                        {humanReadableDate(data.created_at)}
                                    </span>
                                </div>

                                {
                                    data.description === null ? (
                                        <span className="py-3 block text-sm text-stone-500">
                                            <span className="md:block hidden">
                                                No summary description has been added for this withdrawal
                                            </span>
                                            <span className="md:hidden block">
                                                No summary description
                                            </span>
                                        </span>
                                    ) : (
                                        <>
                                            <span className="py-3 block text-sm text-stone-700">
                                                Summary Description:
                                            </span>

                                            <span className="block text-sm text-stone-500">
                                                {data.description}
                                            </span>
                                        </>
                                    )
                                }

                                {/* {
                                    authState.uaid === data.acid ? (
                                        <span className=" py-1 px-1.5 block text-sm text-red-500 float-right">
                                            <i className="fa-light fa-trash fa-lg mr-2"></i>
                                            Delete Request
                                        </span>
                                    ) : null
                                } */}

                            </div>
                        </div>
                    </div>
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

                            <div className="w-full flex flex-row align-middle items-center pb-2 md:pl-3 md:py-1 md:basis-1/2">
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
                                                    No withdrawal requests found
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

                        <div className="w-12/12 pt-6 border-t">
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
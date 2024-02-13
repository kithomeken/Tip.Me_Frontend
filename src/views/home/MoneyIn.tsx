import React, { useState } from "react"

import { Empty } from "../errors/Empty"
import { ACCOUNT } from "../../api/API_Registry"
import ReactTable from "../../lib/hooks/ReactTable"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { API_RouteReplace, formatAmount, humanReadableDate } from "../../lib/modules/HelperFunctions"

export const MoneyIn = ({ account }: { account: string }) => {
    const [state, setstate] = useState({
        status: 'pending',
        data: {
            money_in: null
        }
    })

    React.useEffect(() => {
        moneyInTransactions()
    }, [])

    const moneyInTransactions = async () => {
        let { status } = state
        let { data } = state

        try {
            const apiRoute = API_RouteReplace(ACCOUNT.MONEY_IN_TRANSACTIONS, ':auid', account)
            const response: any = await HttpServices.httpGet(apiRoute)

            if (response.data.success) {
                status = 'fulfilled'
                data.money_in = response.data.payload.in
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
                Header: 'Receipt',
                id: 'TRC_R001',
                accessor: (data: { receipt: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="block text-slate-700 text-sm py-1">
                            {data.receipt}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Phone',
                id: 'TRC_R002',
                accessor: (data: { msisdn: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="block text-slate-500 text-sm py-1">
                            {data.msisdn}
                        </span>
                    </span>
                ),
            },
            {
                Header: 'Amount',
                id: 'TRC_R003',
                accessor: (data: { amount: any }) => (
                    <span className="flex flex-row align-middle items-center">
                        <span className="block text-amber-600 text-sm py-1">
                            {formatAmount(parseInt(data.amount))}
                        </span>
                    </span>
                )
            },
            {
                Header: 'Date',
                id: 'TRC_R004',
                accessor: (data: { tran_date: any }) => (
                    <span className="block mb-0 text-sm text-slate-500">
                        {humanReadableDate(data.tran_date)}
                    </span>
                )
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
                            Money In
                        </h2>

                        <div className="w-12/12">
                            <p className="text-sm form-group text-gray-500">
                                All the contributions from your fans.
                            </p>
                        </div>

                        {
                            state.data.money_in.length < 1 ? (
                                <div className="py-4">
                                    <Empty title="No Transactions Found" description={"We're sure some coins will come trickling in soon..."} />
                                </div>
                            ) : (
                                <div className="w-full">
                                    <ReactTable columns={columns} data={state.data.money_in} />
                                </div>
                            )
                        }
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
import { Helmet } from "react-helmet"
import React, { useState } from "react"

import { Loading } from "../../components/modules/Loading"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"
import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { getColorForLetter, humanReadableDate } from "../../lib/modules/HelperFunctions"
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import ReactTable from "../../lib/hooks/ReactTable"
import { Empty } from "../errors/Empty"

export const Entity = () => {
    const [state, setstate] = useState({
        data: null,
        httpStatus: 200,
        status: 'pending',
    })

    React.useEffect(() => {
        artistEntityDetails()
    }, [])

    const artistEntityDetails = async () => {
        let { httpStatus } = state
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.ENTITY_DETAILS)
            httpStatus = response.status

            if (response.data.success) {
                status = 'fulfilled'
                data = response.data.payload
            } else {
                status = 'rejected'
            }
        } catch (error) {
            status = 'rejected'
            httpStatus = 500
        }

        setstate({
            ...state, status, data, httpStatus
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Entity</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    <div className="py-3 px-4 w-full">
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
                    <div className="w-full pt-6 h-full overflow-y-auto px-2 mx-auto" style={CONFIG_MAX_WIDTH}>
                        <p className="text-2xl text-amber-600 mb-3">
                            Entity Details
                        </p>

                        <div className="flex-none border-b-2 border-dashed pb-3">
                            <p className="text-2xl leading-7 text-stone-500 py-1">
                                {state.data.entity.name}
                            </p>

                            <div className="flex-none flex gap-3 md:flex-row py-4 pb-2 items-center text-slate-600">
                                <span className="block text-sm text-stone-600">
                                    Account: <span className="text-amber-600">{state.data.entity.account}</span>
                                </span>

                                <span className="bg-teal-200 text-teal-700 text-xs py-1 px-1.5 rounded">
                                    <span className="hidden md:inline-block">{state.data.entity.description}</span>
                                    <span className="md:hidden">{state.data.entity.description}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex-none w-full py-4 mb-2 border-b-2 border-dashed">
                            <p className="text-lg leading-7 text-stone-500 py-1">
                                Onboarded Members
                            </p>

                            <ul role="list" className="divide-y divide-stone-100">
                                {
                                    state.data.onB1.map((person: any) => (
                                        <li key={person.acid} className="flex justify-between gap-x-6 py-5">
                                            <div className="flex min-w-0 gap-x-4 items-center align-middle">
                                                {
                                                    person.photo_url ? (
                                                        <>
                                                            <img className="h-10 w-10 flex-none rounded-full bg-stone-50" src={person.photo_url} alt="" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {
                                                                person.display_name.length > 1 ? (
                                                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorForLetter(person.display_name.charAt(0))}`}>
                                                                        <span className="text-white text-lg font-medium">
                                                                            {person.display_name.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorForLetter('X')}`}>
                                                                        <span className="text-white text-lg font-medium">
                                                                            X
                                                                        </span>
                                                                    </div>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                }

                                                <div className="min-w-0 flex-auto">
                                                    <p className="leading-6 text-stone-900">{person.display_name}</p>
                                                    <p className="mt-1 truncate text-xs leading-5 text-stone-500">{person.email}</p>
                                                </div>
                                            </div>

                                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                <p className="text-sm leading-6 text-stone-900">{person.name}</p>

                                                {
                                                    person.status === 'Y' ? (
                                                        <div className="mt-1 flex items-center gap-x-1.5">
                                                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            </div>
                                                            <p className="text-xs leading-5 text-emerald-500">Active</p>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-1 flex items-center gap-x-1.5">
                                                            <div className="flex-none rounded-full bg-red-500/20 p-1">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                            </div>
                                                            <p className="text-xs leading-5 text-red-500">Disabled</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <div className="flex-none w-full pt-4">
                            <p className="text-lg leading-7 text-stone-500 py-1">
                                Invited Members
                                
                                <span className="block text-sm text-stone-500 py-2">
                                    Invited members that have not yet onboarded.
                                </span>
                            </p>

                            <ul role="list" className="divide-y divide-stone-100">
                                {
                                    state.data.inV0.map((person: any) => (
                                        <li key={person.email} className="flex justify-between gap-x-6 py-5 items-center">
                                            <div className="flex min-w-0 gap-x-4 align-middle items-center">
                                                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorForLetter(person.email.charAt(0))}`}>
                                                    <span className="text-white text-lg font-medium">
                                                        {person.email.toUpperCase().charAt(0)}
                                                    </span>
                                                </div>

                                                <div className="min-w-0 flex-auto">
                                                    <p className="leading-6 text-stone-700 truncate text-sm">{person.email}</p>

                                                    <p className="mt-1 md:mt-0 truncate shrink-0 text-xs leading-5 flex items-center gap-x-1.5 text-blue-600 md:hidden">
                                                        <i className="fa-duotone fa-paper-plane"></i>
                                                        <p className="text-xs leading-5">Resend invitation</p>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                <div className="mt-1 flex items-center gap-x-1.5 text-blue-600">
                                                    <i className="fa-duotone fa-paper-plane"></i>
                                                    <p className="text-xs leading-5">Resend invitation</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full py-8 px-4 flex flex-col justify-center">
                        <div className="flex-grow">
                            <Loading />
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    )
}
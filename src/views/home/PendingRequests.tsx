import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"

import { ERR_404 } from "../errors/ERR_404";
import HttpServices from "../../services/HttpServices";
import { ADMINISTRATION } from "../../api/API_Registry";
import { Loading } from "../../components/modules/Loading";
import { API_RouteReplace, DateFormating, renderArtistDocuments } from "../../lib/modules/HelperFunctions";
import { CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry";
import { RejectRequest } from "./RejectRequest";

export const PendingRequests = () => {
    const [state, setstate] = useState({
        show: false,
        status: 'pending',
        response: '000',
        posting: false,
        comment: '',
        data: {
            artist: null,
            request: null,
            documents: null,
        }
    })

    const params = useParams();
    const pageTitle = 'Request Details'

    React.useEffect(() => {
        pendingRequestDetails()
    }, [])

    const pendingRequestDetails = async () => {
        let { data } = state
        let { status } = state

        try {
            const apiRoute = ADMINISTRATION.PENDING_REQUETS + '/' + params.uuid
            const response: any = await HttpServices.httpGet(apiRoute)

            if (response.data.success) {
                data.artist = response.data.payload.artist
                data.request = response.data.payload.request
                data.documents = response.data.payload.documents
                status = 'fulfilled'
            } else {
                status = 'rejected'
            }

            setstate({
                ...state, status, data, show: false
            })
        } catch (error) {
            status = 'rejected'

            setstate({
                ...state, status, data, show: false
            })
        }
    }

    const showOrHideDeclineModal = () => {
        let { show } = state
        show = !state.show

        setstate({
            ...state, show
        })
    }

    const approveOrDenyRequest = async (action: string, comment?: any) => {
        let { posting } = state
        let { response } = state
        posting = true

        try {
            let requestActionRoute = null
            let apiResponse: any = null

            requestActionRoute = API_RouteReplace(ADMINISTRATION.APPROVE_REQUETS, ':uuid', params.uuid)
            apiResponse = await HttpServices.httpPostWithoutData(requestActionRoute)

            posting = false
            response = apiResponse.status.toString()

            setstate({
                ...state, response, posting
            })

            pendingRequestDetails()
        } catch (error) {
            posting = false
            response = '500'

            setstate({
                ...state, response, posting
            })
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>

            <div className="mb-4 px-6 w-full pt-4">
                <div className={`w-full mb-3`}>
                    <div className="kiOAkj" style={CONFIG_MAX_WIDTH}>
                        {
                            state.status === 'rejected' ? (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-10">
                                            <ERR_404
                                                compact={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : state.status === 'fulfilled' ? (
                                <div className="w-full text-sm">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-grow">
                                            <p className="text-2xl leading-7 mb-4 flex-auto text-purple-600">
                                                {state.data.artist.artist_name}
                                            </p>
                                        </div>

                                        {
                                            state.data.request.status === 'N' ? (
                                                <div className="flex-none hidden md:inline-block lg:mt-0 lg:ml-4 text-sm space-x-3">
                                                    <button type="button" onClick={() => approveOrDenyRequest('A')} className={`inline-flex items-center px-4 py-1 border border-green-600 rounded shadow-sm text-sm text-green-700 hover:border-green-800 hover:text-green-800 focus:outline-none`}>
                                                        Approve
                                                    </button>

                                                    <button type="button" onClick={showOrHideDeclineModal} className={`inline-flex items-center px-4 py-1 border border-red-600 rounded shadow-sm text-sm text-red-700 hover:border-red-800 hover:text-red-800 focus:outline-none`}>
                                                        Decline
                                                    </button>
                                                </div>
                                            ) : null
                                        }
                                    </div>

                                    <div className="flex gap-3 md:flex-row md:space-x-1 pb-5 border-b items-center text-slate-600">
                                        {
                                            state.data.request.status === 'Y' ? (
                                                <span className="bg-green-300 text-slate-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Request Approved</span>
                                                    <span className="md:hidden">Approved</span>
                                                </span>
                                            ) : state.data.request.status === 'N' ? (
                                                <span className="bg-sky-300 text-slate-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">New Request</span>
                                                    <span className="md:hidden">New</span>
                                                </span>
                                            ) : (
                                                <span className="bg-red-400 text-white text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Request Rejected</span>
                                                    <span className="md:hidden">Rejected</span>
                                                </span>
                                            )
                                        }

                                        {
                                            state.data.artist.type === 'I' ? (
                                                <span className="bg-amber-300 text-slate-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Individual Artist</span>
                                                    <span className="md:hidden">Individual</span>
                                                </span>
                                            ) : (
                                                <span className="bg-teal-300 text-slate-700 text-xs py-1 px-1.5 rounded">
                                                    <span className="hidden md:inline-block">Band/Duet/Group</span>
                                                    <span className="md:hidden">Band/Group</span>
                                                </span>
                                            )
                                        }

                                        <span className="block text-xs">
                                            {DateFormating(state.data.request.created_at)}
                                        </span>
                                    </div>

                                    <div className="w-full flex flex-col-reverse md:flex-row items- pt-3 border-b md:border-b-0">
                                        <div className="md:basis-2/5 w-full">
                                            <div className="bg-gray-100 rounded mr-4 h-44 mb-3 flex flex-col justify-center">
                                                <img src={`${renderArtistDocuments(state.data.documents.location)}`} className="mb-3 h-36 m-auto rounded text-sm" alt={`${state.data.documents.location}`} />
                                            </div>
                                        </div>

                                        <div className="md:basis-3/5 w-full md:p-3 mb-2 md:border-l flex flex-col">
                                            {
                                                state.data.request.status === 'R' ? (
                                                    <div className="mb-3 w-full lg:w-10/12 px-6 py-2 border-2 border-red-300 border-dashed rounded-md">
                                                        <div className="space-y-2 text- flex flex-col align-middle">
                                                            <div className="text-sm w-full text-red-600">
                                                                <p className="pb-3">
                                                                    <i className="fa-sharp fa-solid fa-circle-exclamation mr-3 fa-xl text-red-400"></i>
                                                                    <span className="text-lg">Request was rejected</span>
                                                                </p>
                                                                <p className="text-sm text-gray-500 pb-3">
                                                                    <span className="font-bold mr-3">Reason:</span>
                                                                    <span className="de">{state.data.request.comments}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : null
                                            }

                                            <div className="flex flex-row w-full lg:w-10/12 border-b pb-3 mb-4">
                                                <div className="basis-1/3 text-slate-500">
                                                    <span className=" py-1 px-1.5 block mb-2">
                                                        First Name:
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2">
                                                        Last Name:
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2">
                                                        E-mail:
                                                    </span>
                                                </div>

                                                <div className="basis-2/3 text-slate-">
                                                    <span className=" py-1 px-1.5 block mb-2 capitalize">
                                                        {state.data.artist.first_name}
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2 capitalize">
                                                        {state.data.artist.last_name}
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2 lowercase">
                                                        {state.data.artist.email}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-row w-full lg:w-10/12 pb-3 mb-4 border-b md:border-b-0">
                                                <div className="basis-1/3 text-slate-500">
                                                    <span className=" py-1 px-1.5 block mb-2">
                                                        <span className="hidden md:inline-block">Document Type:</span>
                                                        <span className="md:hidden">Document:</span>
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2">
                                                        {
                                                            state.data.documents.type === 'ID' ? (
                                                                <span>ID Number:</span>
                                                            ) : (
                                                                <span>
                                                                    <span className="hidden md:inline-block">Passport Number:</span>
                                                                    <span className="md:hidden">Passport:</span>
                                                                </span>
                                                            )
                                                        }
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2">
                                                        <span className="hidden md:inline-block">Phone Number:</span>
                                                        <span className="md:hidden">Phone No:</span>
                                                    </span>
                                                </div>

                                                <div className="basis-2/3 text-slate-">
                                                    <span className=" py-1 px-1.5 block mb-2 capitalize">
                                                        {
                                                            state.data.documents.type === 'ID' ? (
                                                                <span>ID Card</span>
                                                            ) : (
                                                                <span>Passport</span>
                                                            )
                                                        }
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2 capitalize">
                                                        {state.data.documents.identifier}
                                                    </span>

                                                    <span className=" py-1 px-1.5 block mb-2 lowercase">
                                                        {state.data.documents.msisdn}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        state.data.request.status === 'N' ? (
                                            <div className="flex flex-row w-full py-5 md:hidden lg:mt-0 lg:ml-4 text-sm space-x-3">
                                                <button type="button" onClick={() => approveOrDenyRequest('A')} className={`px-4 py-1 basis-1/2 border border-green-600 rounded shadow-sm text-sm text-green-700 hover:border-green-800 hover:text-green-800 focus:outline-none`}>
                                                    Approve
                                                </button>

                                                <button type="button" onClick={showOrHideDeclineModal} className={`basis-1/2 px-4 py-1 border border-red-600 rounded shadow-sm text-sm text-red-700 hover:border-red-800 hover:text-red-800 focus:outline-none`}>
                                                    Decline
                                                </button>
                                            </div>
                                        ) : null
                                    }
                                </div>
                            ) : (
                                <div className="w-full form-group px-12 mb-14">
                                    <div className="w-full">
                                        <div className="pt-10">
                                            <Loading />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            <RejectRequest
                uuid={params.uuid}
                show={state.show}
                showOrHide={showOrHideDeclineModal}
                reloadRequestDetails={pendingRequestDetails}
            />
        </React.Fragment>
    )
}
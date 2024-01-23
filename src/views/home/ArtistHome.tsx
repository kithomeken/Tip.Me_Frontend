import QRCode from 'qrcode'
import { Helmet } from "react-helmet"
import React, { useRef, useState } from "react"
import { useReactToPrint } from 'react-to-print';

import { Loading } from "../../components/modules/Loading"
import { APPLICATION, CONFIG_MAX_WIDTH } from "../../global/ConstantsRegistry"
import { ACCOUNT } from '../../api/API_Registry';
import HttpServices from '../../services/HttpServices';
import { useAppSelector } from '../../store/hooks';
import { API_RouteReplace, classNames, formatAmount } from '../../lib/modules/HelperFunctions';
import { MoneyIn } from './MoneyIn';
import { MoneyOut } from './MoneyOut';
import { WithdrawModal } from './WithdrawModal';

export const ArtistHome = () => {
    const accountState: any = useAppSelector(state => state.account)
    const qrCodeText = APPLICATION.URL + '/artist/' + accountState.account
    const qrCodeImageName = 'qrcode_' + accountState.account + '.png'

    const [qrCode, setQRCode] = useState({
        lowQuality: '',
        highQuality: ''
    });

    const [state, setstate] = useState({
        show: false,
        status: 'pending',
        pageTitle: 'Home',
        activeTab: 'in',
        data: {
            craft: null,
            money_in: null,
        },
    })

    React.useEffect(() => {
        artistDetailsApiCall()
    }, [])

    const artistDetailsApiCall = async () => {
        let { status } = state
        let { data } = state

        try {
            const apiRoute = API_RouteReplace(ACCOUNT.ARTIST_DETAILS, ':auid', accountState.account)
            const response: any = await HttpServices.httpGet(apiRoute)
            console.log(response);

            if (response.data.success) {
                GenerateQRCode()
                status = 'fulfilled'
                data.craft = response.data.payload.craft
                data.craft.bal = formatAmount(parseFloat(data.craft.bal))                
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.log(error);
            status = 'rejected'
        }

        setstate({
            ...state, status, data
        })
    }

    function GenerateQRCode() {
        let { lowQuality } = qrCode
        let { highQuality } = qrCode

        // Low Quality QR Code
        QRCode.toDataURL(
            qrCodeText,
            {
                width: 200,
                margin: 2,
            },
            (err: any, dataImage: any) => {
                if (err) return console.log(err);
                lowQuality = dataImage
            }
        )

        // High Quality QR Code
        QRCode.toDataURL(
            qrCodeText,
            {
                width: 800,
                margin: 2,
            },
            (err: any, dataImage: any) => {
                if (err) return console.log(err);
                highQuality = dataImage
            }
        )

        setQRCode({
            ...qrCode, lowQuality, highQuality
        })
    }

    const activateTab = (tabName: any) => {
        setstate({
            ...state,
            activeTab: tabName
        })
    }

    const showOrHideWithdrawModal = () => {
        let { show } = state
        show = !state.show

        setstate({
            ...state, show
        })
    }

    const loadRespectiveTab = (tab: string = 'in') => {
        switch (tab) {
            case "in":
                return <MoneyIn account={accountState.account} />

            case "out":
                return <MoneyOut account={accountState.account} />

            default:
                return null
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{state.pageTitle}</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    <>

                    </>
                ) : state.status === 'fulfilled' ? (
                    <div className="w-full">
                        <div className={`w-full mb-3`}>
                            <div className="kiOAkj" style={CONFIG_MAX_WIDTH}>
                                <div className="w-full flex flex-col-reverse md:space-x-4 md:flex-row pb-6">
                                    <div className="flex-none flex flex-col justify-center border-t md:border-t-0 pt-3 md:pt-0">
                                        <img src={qrCode.lowQuality} alt="qr_code" className="block text-center m-auto" />

                                        <a className="text-purple-600 w-40 py-2 m-auto px-4 flex flex-row items-center justify-center border border-purple-600 md:hidden text-sm text-center rounded-md bg-white hover:bg-purple-700 focus:outline-none" href={qrCode.highQuality} download={qrCodeImageName}>
                                            <i className="fa-duotone fa-download mr-2 fa-lg"></i>
                                            Download
                                        </a>
                                    </div>

                                    <div className="flex-grow border-0 md:border-l md:ml-3 px-4 py-4">
                                        <div className="w-full">
                                            <div className="w-full flex flex-row items-center -middle">
                                                <span className="py-1 flex-grow px-1.5 block text-2xl text-purple-600 mb-2 capitalize">
                                                    {state.data.craft.name}
                                                </span>

                                                <button type="button" onClick={showOrHideWithdrawModal} className="bg-purple-600 flex-none w-40 py-2 px-4 float-right hidden text-sm md:flex flex-row items-center justify-center text-center rounded-md text-white hover:bg-purple-700 focus:outline-none">
                                                    <i className="fa-light fa-money-bill-wave mr-2 fa-lg"></i>
                                                    Withdraw
                                                </button>
                                            </div>

                                            <span className=" py-1 px-1.5 block text-sm text-slate-700">
                                                <i className="fa-light fa-wallet text-slate-500 fa-lg mr-2"></i>
                                                Wallet
                                            </span>

                                            <div className="w-full flex flex-row align-middle items-center py-1">
                                                <span className=" py-1 px-1.5 text-slate-500 text-xs">
                                                    Ksh.
                                                </span>

                                                <span className=" py-1 px-1.5 text-3xl">
                                                    <span className="text-slate-700">{state.data.craft.bal.split('.')[0]}</span>
                                                    <span className="text-slate-400">.{state.data.craft.bal.split('.')[1]}</span>
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-center py-2">
                                                <button type="button" onClick={showOrHideWithdrawModal} className="text-purple-600 py-2 px-4 sm:hidden text-sm flex flex-row border border-purple-600 items-center justify-center text-center rounded-md bg-white hover:bg-purple-700 focus:outline-none">
                                                    <i className="fa-light fa-money-bill-wave mr-2 fa-lg"></i>
                                                    Withdraw
                                                </button>
                                            </div>

                                            <div className="flex flex-col justify-center md:py-2">
                                                <a className="bg-purple-600 w-40 py-2 px-4 hidden text-sm md:flex flex-row items-center justify-center text-center rounded-md text-white hover:bg-purple-700 focus:outline-none" href={qrCode.highQuality} download={qrCodeImageName}>
                                                    <i className="fa-duotone fa-download mr-2 fa-lg"></i>
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mb-3 px-3">
                                    <div className="w-full flex flex-row">
                                        <div className="md:flex-none cursor-pointer basis-1/2 border-b" onClick={() => activateTab('in')}>
                                            <button className={classNames(
                                                state.activeTab === 'in' ? 'text-green-700 bg-green-200 border-green-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 ',
                                                "text-sm items-center block p-2 px-6 rounded-t rounded-b-none text-center w-full md:w-auto"
                                            )}>
                                                <span className="lolrtn robot">
                                                    Money In
                                                </span>
                                            </button>
                                        </div>

                                        <div className="md:flex-none cursor-pointer basis-1/2 border-b" onClick={() => activateTab('out')}>
                                            <button className={classNames(
                                                state.activeTab === 'out' ? 'text-red-700 bg-red-200 border-red-400' : 'hover:text-gray-700 text-gray-500 hover:bg-gray-100 ',
                                                "text-sm items-center block p-2 px-6 rounded-t rounded-b-none text-center w-full md:w-auto"
                                            )}>
                                                <span className="lolrtn robot">Money Out</span>
                                            </button>
                                        </div>

                                        <div className="flex-grow border-b md:block hidden">

                                        </div>
                                    </div>

                                    <div className="w-full px-3">
                                        {loadRespectiveTab(state.activeTab)}
                                    </div>
                                </div>

                                <div className="flex mb-4 items-center">
                                    <p className="text-2xl flex-auto text-purple-600">

                                    </p>


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

            <WithdrawModal
                show={state.show}
                account={accountState.account}
                showOrHide={showOrHideWithdrawModal}
            />
        </React.Fragment >
    )
}
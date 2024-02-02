import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { classNames } from "../../lib/modules/HelperFunctions"

export const AccountManagement = () => {
    const [state, setstate] = useState({
        status: 'pending',
        activeTab: 'recent',
        data: {
            email: null,
        },
    })

    const setActivateTab = (tabName: any) => {
        setstate({
            ...state,
            activeTab: tabName
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Account Management</title>
            </Helmet>

            <div className={`w-full bg-gradient-to-r from-amber-200 to-emerald-100 form-group mb-3 h-30`}>
                <div className="kiOAkj sttng_strp h-24 px-12">
                    <div className="flex items-center pb-3 pt-3 lg:justify-between w-full">
                        <div className="flex-1 min-w-0">

                        </div>
                    </div>
                </div>
            </div>

            <div className={`md:px-6 w-full form-group mb-3`}>
                <div className="kiOAkj">
                    <div className="flex flex-row mb-4 w-full">
                        <div className="md:w-52 lg:w-60 md:pr-4 pt-4 pb-4 md:border-r">
                            <div className="w-full">
                                <button type="button" onClick={() => setActivateTab('recent')} className={classNames(
                                    state.activeTab === 'recent' ? 'text-amber-700 bg-amber-100' : 'text-slate-700 hover:bg-slate-100',
                                    "text-sm items-center w-full text-left py-2 px-4 rounded"
                                )}>
                                    <span className="flex flex-row align-middle items-center">
                                        <span className="ml-2 flex-auto">
                                            Account Profile
                                        </span>
                                    </span>
                                </button>

                                <button type="button" onClick={() => setActivateTab('security')} className={classNames(
                                    state.activeTab === 'security' ? 'text-amber-700 bg-amber-100' : 'text-slate-700 hover:bg-slate-100',
                                    "text-sm items-center w-full text-left py-2 px-4 rounded mt-2"
                                )}>
                                    <span className="flex flex-row align-middle items-center">
                                        <span className="ml-2 flex-auto">
                                            Security
                                        </span>
                                    </span>
                                </button>

                                <button type="button" onClick={() => setActivateTab('preferences')} className={classNames(
                                    state.activeTab === 'preferences' ? 'text-amber-700 bg-amber-100' : 'text-slate-700 hover:bg-slate-100',
                                    "text-sm items-center w-full text-left py-2 px-4 rounded mb-4 mt-2"
                                )}>
                                    <span className="flex flex-row align-middle items-center">
                                        <span className="ml-2 flex-auto">
                                            Preferences
                                        </span>
                                    </span>
                                </button>

                            </div>

                        </div>

                        <div className="flex-auto rounded pl-4 pt-4 pb-4">
                            {/* {loadRespectiveTab(state.activeTab)} */}
                        </div>
                    </div>
                </div>
            </div>




        </React.Fragment>
    )
}
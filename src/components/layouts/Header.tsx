import { Link } from "react-router-dom";
import React, { FC, useState } from "react";

import { AccountSubHeader } from "./AccountSubHeader";
import { CONFIG_BASE_ROUTE } from "../../global/AppRoutesRegistry";
import { APPLICATION } from "../../global/ConstantsRegistry";

interface headerProps {
    errorMode?: boolean,
    showSettings?: boolean,
}

export const Header: FC<headerProps> = ({ showSettings = true, errorMode = false }) => {
    const [state, setstate] = useState({
        show: {
            setting: false,
        }
    })

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const showOrHideMenuSettings = () => {
        let { show } = state
        show.setting = !state.show.setting

        setstate({
            ...state, show
        })
    }

    return (
        <React.Fragment>
            <nav className="bg-white shadow fixed w-full z-10">
                <div className="max-w-full bg-white mx-auto px-4">
                    <div className="relative flex items-center justify-between h-16">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>

                                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="hidden sm:block">
                                <div className="flex space-x-4">
                                    <Link to="/home" className="text-purple-500 mb-0 nunito font-bold px-0 py-2 rounded-md" aria-current="page">
                                        <span className="text-2xl">
                                            {APPLICATION.NAME}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {
                                !errorMode ? (
                                    <>
                                        <button className="text-slate-500 p-1 ml-3 hidden rounded hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <span className="sr-only">View notifications</span>
                                            <svg className="h-7 w-7" x-description="Heroicon name: outline/bell" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                            </svg>
                                        </button>

                                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                            <Link to={CONFIG_BASE_ROUTE} className="text-slate-500 p-1 rounded hover:text-slate-700 outline-none focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-0">
                                                <span className="sr-only">Settings</span>
                                                <span className="fa-duotone fa-screwdriver-wrench h-7 w-7 fa-lg pt-3 hover:text-purple-500"></span>
                                            </Link>
                                        </div>
                                    </>
                                ) : null
                            }

                            <div className="ml-3 relative">
                                <div>

                                    <AccountSubHeader errorMode={errorMode} />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    )
}
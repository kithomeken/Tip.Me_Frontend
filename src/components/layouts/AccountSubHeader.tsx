import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import React, { FC, Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"

import Crypto from "../../security/Crypto"
import { useAppSelector } from "../../store/hooks"
import StorageServices from "../../services/StorageServices"
import { standardRoutes } from "../../routes/standardRoutes"
import { STORAGE_KEYS } from "../../global/ConstantsRegistry"
import cartoonChar from '../../assets/images/cartoon_character.jpg'
import { revokeAuthSession } from "../../store/auth/firebaseAuthActions"
import { getColorForLetter } from "../../lib/modules/HelperFunctions"

interface headerProps {
    errorMode?: boolean,
}

export const AccountSubHeader: FC<headerProps> = ({ errorMode = false }) => {
    const dispatch: any = useDispatch()
    const auth0: any = useAppSelector(state => state.auth0)

    const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)
    const storageObject = JSON.parse(encryptedKeyString)

    let Identity: any = Crypto.decryptDataUsingAES256(storageObject)
    Identity = JSON.parse(Identity)

    const IdentityRoute: any = (
        standardRoutes.find(
            (routeName: { name: string }) => routeName.name === 'ACCOUNT_PROFILE'
        )
    )?.path

    function classNames(...classes: any[]) {
        return classes.filter(Boolean).join(' ')
    }

    const accountSignOutHandler = () => {
        dispatch(revokeAuthSession())
    }

    return (
        <React.Fragment>
            <Menu as="div" className="relative inline-block text-left float-right">
                {({ open }) => (
                    <>
                        <div className='flex flex-row w-full'>
                            <Menu.Button
                                className={
                                    classNames(
                                        open ? 'text-slate-700' : null,
                                        "flex flex-row items-center w-auto px-3 gap-x-3 rounded py-1 bg-white text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-0 focus:ring-offset focus:ring-offset-slate-100 focus:ring-green-500 align-middle"
                                    )
                                }>
                                <span className="text-sm">{auth0.identity.display_name}</span>

                                {
                                    Identity.photo_url === null ? (
                                        // <img className="ml-4 rounded-full h-10 w-10" src={cartoonChar} alt="avatar" />
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColorForLetter(auth0.identity.display_name.charAt(0))}`}>
                                            <span className="text-white text-xl font-bold">
                                                {auth0.identity.display_name.charAt(0)}
                                            </span>
                                        </div>
                                    ) : (
                                        <img className="ml-4 rounded-full h-10 w-10" src={Identity.photo_url} alt={Identity.photo_url} />
                                    )
                                }
                            </Menu.Button>
                        </div>

                        <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className={classNames(
                                errorMode ? 'w-52 py-0' : 'w-64 py-2', 'origin-top-right absolute right-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                            )}>
                                <div className="pb-">
                                    {
                                        !errorMode ? (
                                            <>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            to={IdentityRoute}
                                                            className={classNames(
                                                                active ? 'bg-slate-100 text-slate-800' : 'text-slate-700',
                                                                'px-4 py-3 text-sm text-left w-full block mt-2'
                                                            )}
                                                        >
                                                            <span className="flex flex-row align-middle items-center pl-1">
                                                                <span className="w-7">
                                                                    <i className="fa-light m-auto fa-user-crown text-base"></i>
                                                                </span>

                                                                <span className="ml-2 flex-auto">
                                                                    Manage Your Account
                                                                </span>
                                                            </span>
                                                        </Link>
                                                    )}
                                                </Menu.Item>

                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button className={classNames(
                                                            active ? 'bg-slate-100 text-slate-800' : 'text-slate-700',
                                                            'px-4 py-3 text-sm text-left w-full block'
                                                        )}
                                                        >
                                                            <span className="flex flex-row align-middle items-center pl-1">
                                                                <span className="w-7">
                                                                    <i className="fa-light m-auto fa-circle-question text-base"></i>
                                                                </span>

                                                                <span className="ml-2 flex-auto">
                                                                    Help & Feedback
                                                                </span>
                                                            </span>
                                                        </button>
                                                    )}
                                                </Menu.Item>

                                            </>
                                        ) : null
                                    }

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={accountSignOutHandler}
                                                className={classNames(
                                                    active ? 'bg-red-100 text-red-800' : 'text-red-700',
                                                    'px-4 py-3 text-sm text-left w-full block'
                                                )}
                                            >
                                                <span className="flex flex-row align-middle items-center pl-1">
                                                    <span className="w-7">
                                                        <i className="fa-light m-auto fa-sign-out text-base"></i>
                                                    </span>

                                                    <span className="ml-2 flex-auto">
                                                        Sign Out
                                                    </span>
                                                </span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </React.Fragment>
    )
}
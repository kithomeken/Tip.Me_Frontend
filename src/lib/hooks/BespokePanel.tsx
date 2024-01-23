import React, { FC, Fragment } from "react"
import { Transition, Dialog } from "@headlessui/react"
import { classNames } from "../modules/HelperFunctions"

interface Props {
    size?: any,
    show: boolean,
    showOrHidePanel: any,
    components?: any,
}

export const BespokePanel: FC<Props> = ({ show, showOrHidePanel, components, size = 'md' }) => {
    return (
        <React.Fragment>
            <Transition.Root show={show} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={showOrHidePanel}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className={classNames(
                                        size === 'md' ? 'max-w-md' : 'max-w-sm',
                                        'pointer-events-auto relative w-screen'
                                    )}>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-in-out duration-500"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in-out duration-500"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                                                <button
                                                    type="button"
                                                    className="rounded-md text-gray-300 hover:text-white focus:outline-none"
                                                    onClick={showOrHidePanel}
                                                >
                                                    <span className="sr-only">Close panel</span>
                                                    <span className="fas fa-times border-none text-xl text-white"></span>
                                                </button>
                                            </div>
                                        </Transition.Child>
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                            {
                                                components
                                            }
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </React.Fragment>
    )
}

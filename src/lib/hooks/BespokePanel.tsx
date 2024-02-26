import React, { FC, Fragment } from "react"
import { Transition, Dialog } from "@headlessui/react"
import { classNames } from "../modules/HelperFunctions"

interface Props {
    size?: any,
    title: any,
    show: boolean,
    showOrHidePanel: any,
    components?: any,
}

export const BespokePanel: FC<Props> = ({ show, title, showOrHidePanel, components, size = 'md' }) => {
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
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
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
                                        <div className="flex h-screen flex-col bg-white shadow-xl overflow-y-auto">
                                            <div className="w-full px-3 py-4 md:px-5 border-b-2 border-dashed">
                                                <div className="top-0 left-0 flex my-0.5 flex-row-reverse align-middle">
                                                    <button
                                                        type="button"
                                                        className="rounded-md text-stone-500 hover:text-amber-600 focus:outline-none flex flex-row align-middle pr-3"
                                                        onClick={showOrHidePanel}
                                                    >
                                                        <span className="fas fa-times border-none text-xl"></span>
                                                        <span className="sr-only text-sm ml-3">Close panel</span>
                                                    </button>

                                                    <div className="flex-grow pl-2">
                                                        <h2 className="text-xl text-amber-600">
                                                            {title}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>

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

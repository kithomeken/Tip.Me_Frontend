import React, { FC } from "react"
import { classNames } from "../../lib/modules/HelperFunctions";

interface Props {
    name: any,
    label: any,
    errorsName: any,
    inputValue: any,
    errorLength: any,
    placeHolder: any,
    onChangeHandler: any,
    onInputBlurHandler: any,
    checkForStatus: boolean,
}

export const InputWithLoadingIcon: FC<Props> = ({errorsName, inputValue, errorLength, onInputBlurHandler, onChangeHandler, checkForStatus, label, placeHolder, name}) => {
    return (
        <React.Fragment>
            <div className="w-12/12 rounded-md shadow-none space-y-px mb-4">
                <label htmlFor={name} className="block text-sm font-normal leading-6 text-gray-600 mb-2">{label}</label>

                <div className="relative mt-2 rounded-md shadow-sm">
                    <input type="text" name={name} id={name} placeholder={placeHolder} autoComplete="off"
                        className={classNames(
                            errorLength > 0 ?
                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:ring-green-600 focus:outline-green-500 hover:border-gray-400',
                            'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 text-sm'
                        )} onChange={onChangeHandler} value={inputValue} onBlur={onInputBlurHandler} required />
                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                        {
                            checkForStatus ? (
                                <span className="fa-duotone text-green-500 fa-spinner-third fa-lg fa-spin"></span>
                            ) : errorLength > 0 ? (
                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                            ) : null
                        }
                    </div>
                </div>

                {
                    errorLength > 0 ? (
                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                            {errorsName}
                        </span>
                    ) : null
                }
            </div>
        </React.Fragment>
    )
}
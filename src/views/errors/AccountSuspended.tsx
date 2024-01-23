import React from "react"
import { Helmet } from "react-helmet"

import imageAsset from '../../assets/images/Hidden-rafiki.svg'

export const AccountSuspended = () => {

    return (
        <React.Fragment>
            <Helmet>
                <title>Account Suspended</title>
            </Helmet>

            <div className="items-center flex flex-col justify-content-center p-6">
                <section className="page_403 m-auto">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <img className="m-auto px-4 pt-6 block text-center mb-5 max-w-sm" src={imageAsset} alt="403_access_denied" />
                            </div>

                            <div className="col-sm-12 sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
                                <div className="col-sm-10 col-sm-offset-1 text-center">
                                    <p className="text-slate-600 py-5 text-sm">
                                        Your account has been Suspended. Reach out to your admin for assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </React.Fragment>
    )
}
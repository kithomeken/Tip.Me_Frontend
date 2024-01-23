import React from "react"
import { Helmet } from "react-helmet"

import imageAsset from '../../assets/images/Hidden-rafiki.svg'
import { getRandomObjectFromArray } from "../../lib/modules/HelperFunctions"

export const ERR_403 = () => {
    const errorMessages = [
        "You've reached the digital equivalent of a VIP area, but without the golden ticket. No worries, we're working on expanding your access pass.",
        "Uh-oh! It seems you've stumbled into a restricted zone. Our bouncers are serious about this, but we're working on giving you an all-access pass. Stay tuned!",
        "This area is like a members-only club, and you're not on the list. Keep exploring the public areas while we sort out your VIP invitation.",
    ]    

    return (
        <React.Fragment>
            <Helmet>
                <title>Access Denied</title>
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
                                    <p className="text-red-500 text-2xl mb-3">ERR_403: Access Denied</p>
                                    <p className="text-slate-600 py-5 text-sm">
                                        {getRandomObjectFromArray(errorMessages)}
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
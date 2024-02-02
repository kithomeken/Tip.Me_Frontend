import React from "react"
import yeat from '../../assets/images/high-angle-man-with-cassette.jpg'


export const Yeat = () => {
    return (
        <React.Fragment>
            <div className="flex items-center flex-col md:flex-row justify-center h-screen dark:bg-gray-800">
                {/* Image */}
                <div className="hidden md:block md:w-3/5 block_strp h-screen">
                    {/* <img src={yeat} alt="Sign In" className="w-full h-full object-cover" /> */}
                </div>

                {/* Sign In Form */}
                <div className="w-full md:w-2/5 p-8">
                    <h1 className="text-3xl font-bold mb-4">Sign In to Tip.Me</h1>

                    {/* Google Sign In Button */}
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4">
                        Sign In with Google
                    </button>

                    {/* Inputs */}
                    <div className="mb-4">
                        <input type="email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded mb-2" />
                        <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    {/* Sign Up Link */}
                    <p className="mb-4 text-sm">
                        Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
                    </p>

                    {/* Sign In Button */}
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full">
                        Sign In
                    </button>

                    {/* Dark Mode Toggle */}
                    <div className="mt-4">
                        <input type="checkbox" id="darkModeToggle" className="hidden" />
                        <label htmlFor="darkModeToggle" className="cursor-pointer text-sm">Dark Mode</label>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
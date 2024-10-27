import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md h-20 flex items-center px-5">
            <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-bold text-[#4D46CF]">PennyTrack</h1>
                <div className="flex gap-5">
                    <a href='/signin'>
                        <button className="bg-gray-200 px-4 py-2 text-sm font-bold text-black border border-gray-300 rounded-md shadow-sm hover:bg-gray-300 transition-transform duration-300 transform hover:scale-105">
                            DashBoard
                        </button>
                    </a>
                    <a href='/signin'>
                    <button className="bg-[#4D46CF] px-4 py-2 text-sm font-bold text-white border border-[#4D46CF] rounded-lg shadow-lg hover:bg-[#3b3b98] transition-transform duration-300 transform hover:scale-105">
                        Get Started
                    </button>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

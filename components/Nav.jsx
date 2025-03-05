import React, { useState, useEffect } from 'react'; 

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const [locationIsEnabled, setLocationIsEnabled] = useState(false);
    const [location, setLocation] = useState({});

    useEffect(() =>{
        navigator.geolocation.getCurrentPosition(success, error, options);
    }, []);

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    const success =(pos) => {
        setLocationIsEnabled(true);
        setLocation(pos.coords);

    };

      const error = (err) => {
        setLocationIsEnabled(false);
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    

    const search = () =>{
        console.log("search");
    };
    
    return (
        <nav className="bg-cyan-800">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="text-white md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <h1 className="text-white text-lg text-center md:text-xl lg:text-3xl">Weather Dashboard</h1>
                <div className="flex">
                    <div className="relative md:block">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" className="block w-60 lg:w-95 md:w-60 p-2 ps-10 text-sm text-black rounded-md bg-white" placeholder="Search by city or Zip code"/>
                    </div>
                </div>
                <div className={`items-center justify-between w-full  md:flex md:w-auto ${isOpen ? "hidden" : "block"}`}>
                    <ul className="flex flex-col p-1 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 ">
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">Today</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">Hourly</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">10-day</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">Monthly</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='bg-cyan-950 w-full h-6 flex items-center justify-center'>
                {locationIsEnabled ? (
                    <p className='text-white text-xs md:text-sm lg:text-base'></p>
                ) : (
                    <p className='text-white text-xs md:text-xs lg:text-base'>Please enable your location for current weather</p>
                )}
            </div>
        </nav>
    );
}

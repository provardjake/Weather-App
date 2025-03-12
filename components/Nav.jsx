import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const [locationIsEnabled, setLocationIsEnabled] = useState(false);
    const [location, setLocation] = useState({});
    const [navWeather, setNavWeather] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    useEffect(() =>{
        setIsActive(true);
    }, []);

    //timer for updating weather data
    useEffect(() => {
        const storedTime = localStorage.getItem('timerTime');
        let intervalId;

        if (storedTime) {
            setSeconds(parseInt(storedTime, 10));
        }

        if (isActive) {
            intervalId = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);

    }, [isActive]);

    //checks every second if weather data needs to be updated. Will update every 15 minutes.
    useEffect(() => {
        const currentTime = Date.now();
        const timeUpdated = parseInt(localStorage.getItem("timeUpdated"));
        localStorage.setItem('timerTime', seconds);

        let storedLocation = localStorage.getItem("location");

        const getLocation = () =>{
            //check if stored location exists. If not, get weather data.
            if(storedLocation === undefined || storedLocation === "undefined" || storedLocation === null){
                navigator.geolocation.getCurrentPosition((pos) =>{
                    setLocationIsEnabled(true);
                    getWeatherData(pos.coords);
                }, error, options); 
            }
            // check if stored location is the same as current location. If not, get new weather data.
            else{
                storedLocation = JSON.parse(storedLocation);
                navigator.geolocation.getCurrentPosition((pos) =>{
                    if(Math.trunc(pos.coords.latitude) !== Math.trunc(storedLocation[0]?.lat) || Math.trunc(pos.coords.longitude) !== Math.trunc(storedLocation[0]?.lon)){
                        setLocationIsEnabled(true);
                        getWeatherData(pos.coords);
                    }
                    else{
                        setLocationIsEnabled(true);
                        setLocation(storedLocation);
                        setNavWeather(JSON.parse(localStorage.getItem("weather")));
                    }
                }, error, options);
            }
        }

        if(currentTime - timeUpdated > 15 * 60 * 1000 || !timeUpdated){
            localStorage?.removeItem("location");
            localStorage?.removeItem("weather");
            getLocation();
        }
        else{
            getLocation();
        }
        
    }, [seconds]);

    const error = (err) => {
        setLocationIsEnabled(false);
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    const getWeatherData = async (pos) => {
        await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.latitude}&lon=${pos.longitude}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            setNavWeather(data);
            localStorage.setItem("weather", JSON.stringify(data));
        });
        localStorage.setItem("timeUpdated", Date.now());
        getCountryState(pos);
        console.log("api called");
    };

    const getCountryState = async (pos) => {
        await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${pos.latitude}&lon=${pos.longitude}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            setLocation(data);
            localStorage.setItem("location",  JSON.stringify(data)); 
        });
        console.log("api called");
    }

    const handleInputChange = (e) =>{
        setSearchInput(e.target.value);
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            searchWeather(e.target.value)
            setSearchInput("");
        }
    }

    const searchWeather = async () =>{

    }
    
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
                <h1 className="text-white text-lg text-center md:text-xl lg:text-3xl"><Link href="/">Weather Dashboard</Link></h1>
                <div className="flex">
                    <div className="relative md:block">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" className="block w-60 lg:w-95 md:w-60 p-2 ps-10 text-sm text-black rounded-md bg-white" placeholder="Search by city or Zip code" value={searchInput} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
                    </div>
                </div>
                <div className={`items-center justify-between w-full  md:flex md:w-auto ${isOpen ? "hidden" : "block"}`}>
                    <ul className="flex flex-col p-1 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 ">
                        <li>
                            <Link href="/today" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">Today</Link>
                        </li>
                        <li>
                            <Link href="/hourly" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">Hourly</Link>
                        </li>
                        <li>
                            <Link href="/ten-day" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">10-day</Link>
                        </li>
                        <li>
                            <Link href="/monthly" className="block py-2 px-3 text-white rounded-sm md:p-0 lg:text-xl">Monthly</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='bg-cyan-950 w-full h-6 flex items-center justify-center'>
                {locationIsEnabled ? (
                    <p className='text-white text-xs md:text-sm lg:text-base'>{Math.trunc(navWeather?.main?.temp)}&deg; {navWeather?.name}, {location[0]?.state || location[0]?.country}</p>
                ) : (
                    <p className='text-white text-xs md:text-xs lg:text-base'>Please enable your location for current weather</p>
                )}
            </div>
        </nav>
    );
}
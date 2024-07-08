import React, { useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/clouds.png';
import drizzle_icon from '../assets/drizzle.png';
import mist_icon from '../assets/mist.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png'

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(false);
    const [inMetricUnits, setInMetricUnits] = useState(true);

    const icons = {
        "Clouds": cloud_icon,
        "Clear": clear_icon,
        "Drizzle": drizzle_icon,
        "Mist": mist_icon,
        "Rain": rain_icon,
        "Snow": snow_icon
    }

    const search = async (city) => {
        if(city === "") {
            alert("Enter city name!");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${process.env.REACT_APP_API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();
            const icon = icons[data.weather[0].main] || clear_icon;

            if(!response.ok) {
                setWeatherData(false);
                alert("Invalid city name");
                return;
            }

            console.log(data);

            note()

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temp: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            })
        } catch(error) {
            setWeatherData(false);
            console.error("Error occured whilst fetching data");
        }
    }

    const toggleMetrics = () => {
        if (inMetricUnits) {
            // Convert to US metrics
            setWeatherData(prevData => ({
                ...prevData,
                temp: Math.round((prevData.temp * 1.8) + 32),
                windSpeed: (prevData.windSpeed * 0.6213711922).toFixed(2)
            }));
        } else {
            // Convert to UK metrics
            setWeatherData(prevData => ({
                ...prevData,
                temp: Math.round((prevData.temp - 32) / 1.8),
                windSpeed: (prevData.windSpeed * 1.609344).toFixed(2)
            }));
        }
        setInMetricUnits(!inMetricUnits);
    }

    const note = (function() {
        let executed = false;
        return function() {
            if (!executed) {
                executed = true;
                const myTimeout = setTimeout(() => {
                    document.querySelector(".note").style.display = "none";
                }, 3000);   
                
                function stopFunction() {
                    clearTimeout(myTimeout);
                }
            }
        };
    })();

    return (
        <div className='weather'>
            <div className='search-bar'>
                <input ref={inputRef} type="text" placeholder='Enter city name' spellCheck='false'></input>
                <img src={search_icon} alt='' onClick={() => search(inputRef.current.value)}/>
            </div>
            {weatherData ? 
                <>
                    <img src={weatherData.icon} alt='The icon representing the current weather' className='weather-icon' />
                    <div className="note">
                        <p>Click temperature to change metrics</p>
                    </div>
                    <p className='temp' onClick={toggleMetrics}>{weatherData.temp}º{inMetricUnits ? 'C' : 'F'}</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-details">
                        <div className="col">
                            <img src={humidity_icon} alt='Humidity icon' />
                            <div>
                                <p class="humidity">{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        <div className="col">
                            <img src={wind_icon} alt='Wind icon' />
                            <div>
                                <p className="wind">{weatherData.windSpeed} {inMetricUnits ? 'mph' : 'km/h'}</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </> :
                <></>
            }
        </div>
    )
};

export default Weather;
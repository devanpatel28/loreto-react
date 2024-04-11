import React, { useEffect, useState } from 'react'
import CardDataStats from '../../components/CardDataStats';
import DefaultLayout from '../../layout/DefaultLayout'
import { Outlet, Link } from "react-router-dom";

const totalStudent = 200
const Dashboard = () => {
  const [userdata,setUserdata] = useState([]);

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("userdata"));
   setUserdata(temp);
    console.log(temp);
    
  }, [])
  
    return (
        <DefaultLayout>
            <div>Dashboard</div><br />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          
        <Link to="/students">
          <CardDataStats title="Total Students" total= {totalStudent}>
          <svg 
            version="1.1" 
            id="Layer_1"
            width="30"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 64 64"
            fill="#FF3131"
            >
            <g>
              <path class="st0" d="M43.6,55.5c3.1-0.1,5.6-2.7,5.5-5.9c0-0.7-0.2-1.4-0.5-2.1c-3.5-8.8-9.7-14.6-16.8-14.6s-13.1,5.7-16.6,14.3
                c-1.3,2.9,0,6.3,2.9,7.5c0.6,0.3,1.3,0.4,2,0.5L43.6,55.5z"/>
              <circle class="st0" cx="32" cy="18.4" r="9.9"/>
            </g>
            </svg>
          </CardDataStats>
        </Link>
        <CardDataStats total= "Attendance">
          <svg
            className="fill-primary dark:fill-white"
            width="35"
            viewBox="0 0 64 64"
            fill="#FF4B07"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path fill="#20263b"
            d="M45.62 30.38h-8.4a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5h8.4a5 5 0 0 1 5 5v8.4A5 5 0 0 1 45.62 30.38zM37.22 16a1 1 0 0 0-1 1v8.4a1 1 0 0 0 1 1h8.4a1 1 0 0 0 1-1V17a1 1 0 0 0-1-1zM23.61 30.38h-8.4a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5h8.4a5 5 0 0 1 5 5v8.4A5 5 0 0 1 23.61 30.38zM15.21 16a1 1 0 0 0-1 1v8.4a1 1 0 0 0 1 1h8.4a1 1 0 0 0 1-1V17a1 1 0 0 0-1-1zM23.61 52h-8.4a5 5 0 0 1-5-5V38.62a5 5 0 0 1 5-5h8.4a5 5 0 0 1 5 5V47A5 5 0 0 1 23.61 52zm-8.4-14.39a1 1 0 0 0-1 1V47a1 1 0 0 0 1 1h8.4a1 1 0 0 0 1-1V38.62a1 1 0 0 0-1-1z" />
          <path fill="#FF3131"
            d="M41,49.11a5,5,0,0,1-3.59-1.53l-4.59-4.75a2,2,0,1,1,2.87-2.78l4.6,4.75a1,1,0,0,0,1.55-.14l8.31-12.6a2,2,0,1,1,3.34,2.2l-8.31,12.6a5,5,0,0,1-3.71,2.22A3.71,3.71,0,0,1,41,49.11Z" />
          </svg>
        </CardDataStats>
        <CardDataStats total= "Holiday">
          <svg
            className="fill-primary dark:fill-white"
            width="35"
            viewBox="0 0 64 64"
            fill="#FF4B07"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path fill="#ff4b07"
        d="M32,47.05a15,15,0,1,1,15-15A15.07,15.07,0,0,1,32,47.05ZM32,21A11.05,11.05,0,1,0,43.05,32,11.07,11.07,0,0,0,32,21Z" />
    <path fill="#20263b"
        d="M32 12.16a2 2 0 0 1-2-2V6.32a2 2 0 0 1 4 0v3.84A2 2 0 0 1 32 12.16zM32 59.68a2 2 0 0 1-2-2V53.84a2 2 0 0 1 4 0v3.84A2 2 0 0 1 32 59.68zM57.68 34H53.84a2 2 0 0 1 0-4h3.84a2 2 0 1 1 0 4zM10.16 34H6.32a2 2 0 0 1 0-4h3.84a2 2 0 0 1 0 4zM47.44 18.56A2 2 0 0 1 46 15.14l2.72-2.71a2 2 0 0 1 2.82 2.82L48.86 18A2 2 0 0 1 47.44 18.56zM13.84 52.16a2 2 0 0 1-1.41-3.41L15.14 46A2 2 0 0 1 18 48.86l-2.72 2.71A2 2 0 0 1 13.84 52.16zM50.16 52.16a2 2 0 0 1-1.41-.59L46 48.86A2 2 0 0 1 48.86 46l2.71 2.72a2 2 0 0 1-1.41 3.41zM16.56 18.56A2 2 0 0 1 15.14 18l-2.71-2.72a2 2 0 0 1 2.82-2.82L18 15.14a2 2 0 0 1-1.41 3.42z" /></svg>
        </CardDataStats>
      </div>
      <Outlet />
        </DefaultLayout>
    )
}

export default Dashboard
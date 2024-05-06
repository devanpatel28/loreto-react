import React, { useEffect, useState } from 'react'
import CardDataStats from '../../components/CardDataStats';
import DefaultLayout from '../../layout/DefaultLayout'
import { Outlet, Link } from "react-router-dom";
import { GET_STUDENT_COUNT_API, GET_UPCOMING_EVENTS_API, GET_UPCOMING_HOLIDAY_API } from '../../helper/api';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [event, setEvent] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(GET_STUDENT_COUNT_API);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchUpcoming = async () => {
      try {
        const response = await axios.get(GET_UPCOMING_HOLIDAY_API);
        setHoliday(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchEvent = async () => {
      try {
        const response = await axios.get(GET_UPCOMING_EVENTS_API);
        setEvent(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    fetchUpcoming();
    fetchEvent();
  }, []);
  return (
    <DefaultLayout>
      <div className='pr-1 pl-1'>
        <div>Dashboard</div><br />
        <div className={"mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5"}>
          <div className="rounded-md overflow-hidden border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-4">
              <div className="flex items-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-bold text-black">Upcoming Holiday</span>
                </p>
                <svg
                  className="fill-primary dark:fill-white ml-2 mb-1"
                  width="25"
                  viewBox="0 0 64 64"
                  fill="#FF4B07"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#ff4b07"
                    d="M32,47.05a15,15,0,1,1,15-15A15.07,15.07,0,0,1,32,47.05ZM32,21A11.05,11.05,0,1,0,43.05,32,11.07,11.07,0,0,0,32,21Z"
                  />
                  <path
                    fill="#20263b"
                    d="M32 12.16a2 2 0 0 1-2-2V6.32a2 2 0 0 1 4 0v3.84A2 2 0 0 1 32 12.16zM32 59.68a2 2 0 0 1-2-2V53.84a2 2 0 0 1 4 0v3.84A2 2 0 0 1 32 59.68zM57.68 34H53.84a2 2 0 0 1 0-4h3.84a2 2 0 1 1 0 4zM10.16 34H6.32a2 2 0 0 1 0-4h3.84a2 2 0 0 1 0 4zM47.44 18.56A2 2 0 0 1 46 15.14l2.72-2.71a2 2 0 0 1 2.82 2.82L48.86 18A2 2 0 0 1 47.44 18.56zM13.84 52.16a2 2 0 0 1-1.41-3.41L15.14 46A2 2 0 0 1 18 48.86l-2.72 2.71A2 2 0 0 1 13.84 52.16zM50.16 52.16a2 2 0 0 1-1.41-.59L46 48.86A2 2 0 0 1 48.86 46l2.71 2.72a2 2 0 0 1-1.41 3.41zM16.56 18.56A2 2 0 0 1 15.14 18l-2.71-2.72a2 2 0 0 1 2.82-2.82L18 15.14a2 2 0 0 1-1.41 3.42z"
                  />
                </svg>
              </div>

              <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium text-black">Date: </span>
                <span>{holiday !== null ? holiday.holiday_date : 'Loading...'}</span>
              </p>
              <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium text-black">Name: </span>
                <span>{holiday !== null ? holiday.holiday_name : 'Loading...'}</span>
              </p>
            </div>
          </div>
          <div className="rounded-md overflow-hidden border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-4">
              <div className="flex items-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-bold text-black">Upcoming Event</span>
                </p>
                <svg
                  className="fill-primary dark:fill-white ml-2 mb-3"
                  width="25"
                  viewBox="0 0 64 64"
                  fill="#FF4B07"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="#ff4b07"
                    d="M54.54,18.13v8.92a1,1,0,0,1-1,1H10.46a1,1,0,0,1-1-1V18.13a3.46,3.46,0,0,1,3.47-3.46H51.07A3.46,3.46,0,0,1,54.54,18.13Z" />
                  <path fill="#20263b"
                    d="M49.44 58.46H14.56A5.17 5.17 0 0 1 9.39 53.3V32.44a2 2 0 0 1 4 0V53.3a1.17 1.17 0 0 0 1.17 1.16H49.44a1.17 1.17 0 0 0 1.17-1.16V32.44a2 2 0 0 1 4 0V53.3A5.17 5.17 0 0 1 49.44 58.46zM22.26 22a2 2 0 0 1-2-2V7.54a2 2 0 1 1 4 0V20A2 2 0 0 1 22.26 22zM41.83 22a2 2 0 0 1-2-2V7.54a2 2 0 1 1 4 0V20A2 2 0 0 1 41.83 22z" />
                </svg>
              </div>
              <div className="overflow-y-scroll">
                <p className="text-md text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium text-black">Date: </span>
                  <span>{event.event_date}</span>
                </p>
                <p className="text-md text-gray-600 dark:text-gray-400 mb-2" style={{ maxHeight: "3rem" }}>
                  <span className="font-medium text-black">Description: </span>
                  <span>{event.event_description}</span>
                </p>
              </div>
            </div>
          </div>


        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <Link to="/manage-student">
            <CardDataStats title="Students" total={data !== null ? data : 'Loading...'}>
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
                  <circle class="st0" cx="32" cy="18.4" r="9.9" />
                </g>
              </svg>
            </CardDataStats>
          </Link>

          <Link to="/attendance">
          <CardDataStats total="Attendance">
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
          </Link>

          <Link to="/holidays">
            <CardDataStats total="Holiday">
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
          </Link>

          <Link to="/books">
            <CardDataStats total="Books">
              <svg
                className="fill-primary dark:fill-white"
                width="35"
                viewBox="0 0 64 64"
                fill="#FF4B07"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="#ff4b07"
                  d="M52.34,15.69v2.93H34.54a3.47,3.47,0,0,1-3.38-2.69l-.88-3.84H48.75A3.6,3.6,0,0,1,52.34,15.69Z" />
                <path fill="#20263b"
                  d="M52.11,49.91H19.19a5,5,0,0,1-5-5V12a5,5,0,0,1,5-5H27a5,5,0,0,1,4.87,3.88l1.15,5a1,1,0,0,0,1,.78H52.11a5,5,0,0,1,5,5V37.05a2,2,0,0,1-4,0V21.62a1,1,0,0,0-1-1H34a5,5,0,0,1-4.87-3.88l-1.15-5A1,1,0,0,0,27,11H19.19a1,1,0,0,0-1,1V44.91a1,1,0,0,0,1,1H52.11a1,1,0,0,0,1-1,2,2,0,0,1,4,0A5,5,0,0,1,52.11,49.91Z" />
                <path fill="#20263b"
                  d="M44.81,57H18.47A11.6,11.6,0,0,1,6.89,45.43V19.09a2,2,0,1,1,4,0V45.43A7.6,7.6,0,0,0,18.47,53H44.81a2,2,0,0,1,0,4Z" />
              </svg>
            </CardDataStats>
          </Link>

        </div>

        <Outlet />
      </div>
    </DefaultLayout>
  )
}

export default Dashboard
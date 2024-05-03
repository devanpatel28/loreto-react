import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { FIND_SHIFT_API, GET_EVENT_API } from "../../helper/api";
import { underDev } from "../../helper/alert";

const EventsPage = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [shiftName, setShiftName] = useState({});
    const [isGridView, setIsGridView] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_EVENT_API);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Fetch shift names for each event
        data.forEach((event) => {
            fetchShiftName(event.shiftdatum_id);
        });
    }, [data]);

    const fetchShiftName = async (shiftdatum_id) => {
        try {
            const response = await axios.post(FIND_SHIFT_API, {
                id: shiftdatum_id,
            });
            setShiftName(prevState => ({
                ...prevState,
                [shiftdatum_id]: response.data.data.shift_name
            }));
        } catch (error) {
            console.error("Error fetching Shift name:", error);
        }
    };

    const filteredData = data.filter((event) => {
        return search === '' ? true : event.event_description.toLowerCase().includes(search.toLowerCase());
    });

    const isToday = (someDate) => {
        const today = new Date();
        return someDate.getDate() === today.getDate() &&
               someDate.getMonth() === today.getMonth() &&
               someDate.getFullYear() === today.getFullYear();
    };

    // Sort events by date, newest first
    const sortedData = filteredData.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

    const handleViewToggle = () => {
        setIsGridView(!isGridView);
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Events" />
            <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex items-center">
                    <NavLink to="/add-event">
                        <button className="min-w-50 mr-10 inline-flex items-center justify-center gap-2.5 bg-graydark py-3 border-2 text-center font-medium text-white duration-200 ease-in-out hover:bg-opacity-0 hover:text-graydark hover:border-2">
                            <IoAdd size={30} />
                            Add Event
                        </button>
                    </NavLink>
                    <input
                        type="text"
                        placeholder="Search Event"
                        className="border w-150 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <button
                        className="bg-graydark py-1 px-3 text-white border-2 text-sm font-medium text-center duration-200 ease-in-out hover:bg-opacity-0 hover:border-graydark hover:border-2 hover:text-graydark"
                        onClick={handleViewToggle}
                    >
                        {isGridView ? "List View" : "Grid View"}
                    </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-${isGridView?"2":1} gap-6`}>
                {sortedData.map((event, key) => (
                    <div key={key} className={"w-full relative"}>
                        <div className="rounded-md overflow-hidden border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span className="font-medium text-black">Date:</span>{" "}
                                    <span>{event.event_date}</span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span className="font-medium text-black">Shift:</span>{" "}
                                    <span>{shiftName[event.shiftdatum_id]}</span>
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span className="font-medium text-black">Details:</span>{" "}
                                    <span>{event.event_description}</span>
                                </p>
                            </div>
                        </div>
                        {isToday(new Date(event.event_date)) && (
                            <div className="absolute pl-5 pr-5 top-3 right-3 bg-green-100 text-green-500 py-1 px-3 rounded-xl text-xs font-semibold">Today</div>
                        )}
                        {!isToday(new Date(event.event_date)) && new Date(event.event_date) < new Date() && (
                            <div className="absolute top-3 right-3 bg-blue-100 text-blue-500 py-1 px-3 rounded-xl text-xs font-semibold">Completed</div>
                        )}
                        {!isToday(new Date(event.event_date)) && new Date(event.event_date) > new Date() && (
                            <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-600 py-1 px-3 rounded-xl text-xs font-semibold">Upcoming</div>
                        )}
                    </div>
                ))}
            </div>
        </DefaultLayout>
    );
};

export default EventsPage;

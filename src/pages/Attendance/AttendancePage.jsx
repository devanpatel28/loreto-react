import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import DatePicker from "react-datepicker"; // Assuming you are using react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns"; // Import date formatting function
import { GET_TEACHER_API, CHANGE_TYPE_API, CHANGE_USER_STATUS_API, GET_HOLIDAY_API, CHANGE_HOLIDAY_API, ATTENDANCE_API, TODAY_ATTENDANCE_API, GET_SHIFT_API, UPDATE_ATTENDANCE_API } from "../../helper/api";

import Swal from "sweetalert2";

const AttendancePage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [Data, setData] = useState([]);
    const [oldData, setOldData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // State to manage selected date
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState('');

    useEffect(() => {
        getTodayStudent();
        fetchShift();
    }, []);

    const fetchShift = async () => {
        try {
            const response = await axios.get(GET_SHIFT_API);
            setShifts(response.data.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }

    const addTodayStudent = async () => {
        try {
            const response = await axios.post(ATTENDANCE_API, { date: format(new Date(), "yyyy-MM-dd") });
            // getTodayStudent();
        } catch (error) {
            console.error("Error fetching data:", error);

        }
    };
    const getTodayStudent = async () => {
        await addTodayStudent();
        try {
            const response = await axios.get(ATTENDANCE_API);
            setData(response.data.data);
            setOldData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    };
    const saveAttendance = async () => {
        try {
            await axios.put(UPDATE_ATTENDANCE_API, Data);
            getTodayStudent();
            setData([]);
            setOldData([]);
            Swal.fire({
                icon: "success",
                text: "Attendance Updated",
                showConfirmButton: false,
                width: "20rem",
                timer: 1000,
            });
        } catch (error) {
            console.error("Error updating attendance:", error);
        }
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleShiftChange = (e) => {
        setSelectedShift(e.target.value);
    };

    const filteredData = Data.filter((attendance) => {
        const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Format selected date
        return (
            (search === '' || attendance.full_name.toLowerCase().includes(search.toLowerCase())) && // Check search criteria
            (attendance.date === formattedDate) && // Check for selected date
            (selectedShift === '' || attendance.shiftdatum_id == selectedShift) // Check for selected shift
        );
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Attendace" />
            <div className="flex justify-normal items-center mb-4 w-50">
                <form className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search Student"
                        className="border w-90 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        maxDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        className="border ml-3 w-50 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <select
                        className="border ml-3 w-50 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={selectedShift}
                        onChange={handleShiftChange}
                    >
                        <option value="">All Shifts</option>
                        {shifts.map((shift) => (
                            <option key={shift.id} value={shift.id}>
                                {shift.shift_name}
                            </option>
                        ))}
                    </select>
            
                </form>
                <div className="ml-19 font-medium text-black dark:text-white">
                {oldData.length !== Data.length || oldData.some((item, index) => item.id !== Data[index].id || item.status !== Data[index].status) ? (
                    <button onClick={saveAttendance} className="w-40 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium shadow-sm text-white bg-graydark hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Save Attendance
                    </button>
                ) : null}
            </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-3 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">

                        <thead>
                            <tr className="bg-red-50 text-left dark:bg-meta-">
                                <th className="min-w-10 py-4 px-4 font-medium text-black dark:text-white ">
                                    No
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Name
                                </th>
                                <th className="py-4 px-6 font-medium text-black dark:text-white">
                                    Status
                                </th>

                            </tr>

                        </thead>
                        <tbody>
                            {filteredData.map((attendance, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-2 px-4  dark:border-strokedark ">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {key + 1}
                                        </h5>
                                    </td>

                                    <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {attendance.full_name}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setData(prevData => (
                                                    prevData.map(item => item.id === attendance.id ? { ...item, status: "Present" } : item)
                                                ))}
                                                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${attendance.status === "Present" ? 'bg-success text-success' : 'bg-gray-400 text-gray-200'}`}>
                                                Present
                                            </button>
                                            <button
                                                onClick={() => setData(prevData => (
                                                    prevData.map(item => item.id === attendance.id ? { ...item, status: "Absent" } : item)
                                                ))}
                                                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${attendance.status === "Absent" ? 'bg-danger text-danger' : 'bg-gray-400 text-gray-200'}`}>
                                                Absent
                                            </button>
                                            <button
                                                onClick={() => setData(prevData => (
                                                    prevData.map(item => item.id === attendance.id ? { ...item, status: "On Leave" } : item)
                                                ))}
                                                className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${attendance.status === "On Leave" ? 'bg-warning text-warning' : 'bg-gray-400 text-gray-200'}`}>
                                                On Leave
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>
            </div>

        </DefaultLayout>
    );
};

export default AttendancePage;


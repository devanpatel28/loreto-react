import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { GET_TEACHER_API, CHANGE_TYPE_API, CHANGE_USER_STATUS_API, GET_HOLIDAY_API, CHANGE_HOLIDAY_API } from "../../helper/api";

import Swal from "sweetalert2";

const HolidaysPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('full_name');
    const [currentPage, setCurrentPage] = useState(1);
    const [Data, setData] = useState([]);
    const [editHolidayId, setHolidayId] = useState(null);
    const [editUserType, setEditUserType] = useState("");
    const [editUserStatus, setEditUserStatus] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_HOLIDAY_API);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    const changeStatus= async (Hid,HDame,HDate,HStatus) =>
    {
        console.log(Hid);
        Swal.fire({
            text: "Are you sure to change ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
          }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.put(CHANGE_HOLIDAY_API,
                    {
                        id: Hid,
                        holiday_name: HDame,
                        holiday_date: HDate,
                        is_holiday: !HStatus
                    } 
            );
              Swal.fire({
                title: "Updated!",
                text: "Changes successfully saved!",
                icon: "success",
                showConfirmButton: false,
              });
                window.location.reload();
                navigate('/holidays')
            }
          });
    }


    const filteredData = Data.filter((holiday) => {
        return search === '' ? true : holiday.holiday_name.toLowerCase().includes(search.toLowerCase());
    });

 
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Holidays" />
            <div className="flex justify-normal items-center mb-4 w-50">
                <form className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search Holiday"
                        className="border w-100 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </form>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-3 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">

                        <thead>
                            <tr className="bg-red-50 text-left dark:bg-meta-4">
                                <th className="min-w-10 py-4 px-4 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        ID
                                    </span>
                                </th>
                                <th className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        Date
                                    </span>
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Name
                                </th>
                                <th className="py-4 px-6 font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((holiday, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-2 px-4  dark:border-strokedark ">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {holiday.id}
                                        </h5>

                                    </td>
                                    <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {holiday.holiday_date}
                                        </h5>

                                    </td>
                                    <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {holiday.holiday_name}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        <p
                                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${holiday.is_holiday
                                                    ? 'bg-success text-success'
                                                    : 'bg-danger text-danger'
                                                }`}
                                        >
                                            {holiday.is_holiday ? 'Holiday' : 'Working Day'}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-2 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button onClick={() =>changeStatus(holiday.id,holiday.holiday_name,holiday.holiday_date,holiday.is_holiday)} class="mx-0 px-2 text-sm py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                                Change Status
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

export default HolidaysPage;


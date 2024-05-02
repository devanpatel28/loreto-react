import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { FIND_SHIFT_API, GET_STUDENT_API, GET_STUDENT_DATA_API } from "../../helper/api";
import { underDev } from "../../helper/alert";

const ViewStudent = () => {
    const [Data, setData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedStudent = localStorage.getItem("selectedStudent");
                console.log("storedStudent : "+storedStudent)
                const response = await axios.post(GET_STUDENT_DATA_API,{
                    id:storedStudent
                });
                setData(response.data.data);
                console.log("response.data.data : "+response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Student Info" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                <div className="p-7">
                    <form action="#">
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div className="w-full sm:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white"
                                 htmlFor="fullName"> Fullname</label>

                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" 
                                name="fullName"
                                 id="fullName">
                                    {Data.userdata?.full_name}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white"
                                 htmlFor="username">Username</label>
                                 
                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" 
                                name="username"
                                 id="username">
                                    {Data.login?.username}
                                </div>
                            </div>
                    </div>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div className="w-full sm:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white"
                                 htmlFor="mobile"> Contact Number</label>

                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" 
                                name="mobile"
                                 id="mobile">
                                    {Data.userdata?.mobile_number}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white"
                                 htmlFor="email"> Email</label>
                                 
                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" 
                                name="email"
                                 id="email">
                                    {Data.login?.email}
                                </div>
                            </div>
                    </div>
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ViewStudent;

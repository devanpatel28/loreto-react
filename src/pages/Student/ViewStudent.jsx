import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd, IoArrowBack, IoArrowForward } from "react-icons/io5";
import axios from "axios";
import { ADD_COURSEENROLL_API, FIND_SHIFT_API, GET_COURSE_API, GET_COURSE_LEVEL_API, GET_STUDENT_API, GET_STUDENT_ATTENDANCE_API, GET_STUDENT_DATA_API } from "../../helper/api";
import { underDev } from "../../helper/alert";
import CourseCard from "../../components/CourseCard";
import Swal from "sweetalert2";
import { format } from "date-fns";

const ViewStudent = () => {
    const [Data, setData] = useState([]);
    const [viewPopup, setViewpopup] = useState(null);
    var address = "";
    const [courses, setCourses] = useState([]);
    const [levels, setLevels] = useState([]);
    const [formData, setFormData] = useState({
        course_id: "",
        course_level_id: "",
        last_month: "",
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get(GET_COURSE_API);
                setCourses(response.data.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedStudent = localStorage.getItem("selectedStudent");
                console.log("storedStudent : " + storedStudent)
                const response = await axios.post(GET_STUDENT_DATA_API, {
                    id: storedStudent
                });
                setData(response.data.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const fetchAttandance = async () => {
            try {
                const storedStudent = localStorage.getItem("selectedStudent");
                console.log("storedStudent : " + storedStudent)
                const response = await axios.post(GET_STUDENT_ATTENDANCE_API, {
                    id: storedStudent
                });
                setAttendanceData(response.data.data);
                console.log("response.data.data : " + response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchAttandance();
        fetchData();
    }, []);

    const handleCourseChange = async (e) => {
        const course_id = e.target.value;
        console.log("Selected course ID:", course_id);
        console.log(courses);
        const selectedCourse = courses.find(course => course.id == course_id);
        setFormData(prevState => ({
            ...prevState,
            course_id,
            last_month: calculateLastMonthDate(selectedCourse.time_duration)
        }));
        const calculateLastMonthDate = (courseDuration) => {
            const today = new Date();
            console.log(today + "----- today");
            const lastMonth = new Date(today.getFullYear(), today.getMonth() + courseDuration, today.getDate());
            console.log(lastMonth + "----- lastMonth");
            return lastMonth;
        };

        try {
            const response = await axios.post(GET_COURSE_LEVEL_API, { course_id: course_id });
            setLevels(response.data.data);
        } catch (error) {
            console.error("Error fetching course levels:", error);
            setLevels([]);
        }
    };

    const handleLevelChange = (e) => {
        setFormData({ ...formData, course_level_id: e.target.value });
    };

    const addNewCourse = async (e) => {
        e.preventDefault();
        const { course_level_id, course_id, last_month } = formData;
        const today = new Date();
        try {
            console.log(today);
            console.log("Course ID:", course_id);
            console.log("Course Level ID:", course_level_id);
            console.log("Last Month", last_month);
            console.log("Student ID:", Data.userdata.id);
            await axios.post(ADD_COURSEENROLL_API, {
                enrollment_date: today,
                is_current_course: 1,
                last_month: last_month,
                course_status: 1,
                studentdatum_id: Data.userdata.id,
                course_id: course_id,
                course_level_id: course_level_id || null,
            });
            setViewpopup(null);
            await Swal.fire({
                icon: "success",
                text: "Student added successfully!",
                width: "400px",
                timer: 1000,
                showConfirmButton: false,
            });
            setFormData({
                course_id: "",
                course_level_id: "",
                last_month: "",
            });
            window.location.reload();
        } catch (error) {
            console.error("Error adding course:", error);
            Swal.fire({
                icon: "error",
                text: "Something Went Wrong!",
                width: "400px",
                timer: 1000,
                showConfirmButton: false,
            });
        }
    };

    const viewPopUp = () => {
        event.preventDefault();
        setViewpopup(true);
    };


    if (Data.userdata?.block_number == null && Data.userdata?.street_name == null && Data.userdata?.city == null && Data.userdata?.state == null && Data.userdata?.pincode == null) {
        address = "No Address Provided";
    }
    else {
        address = `${Data.userdata?.block_number} ${Data.userdata?.street_name} ${Data.userdata?.city} ${Data.userdata?.state} ${Data.userdata?.pincode}`
    }

    const renderAttendanceCalendar = () => {
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const calendarDates = [];
        let firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // Day of the week for the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; // Array of day names

        // Push empty cells for the days before the first day of the month to align the calendar
        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarDates.push(
                <div key={`empty-${i}`} className="text-center py-2 border border-gray-300 w-full"></div>
            );
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const attendance = attendanceData.find(item => new Date(item.date).getDate() === currentDate.getDate() && new Date(item.date).getMonth() === currentDate.getMonth() && new Date(item.date).getFullYear() === currentDate.getFullYear());
            const color = attendance ? (
                attendance.status === "Present" ? "bg-green-500 text-white border-none font-medium p-2"
                    : attendance.status === "Absent" ? "bg-red-500 text-white border-none font-medium p-2"
                        : "bg-yellow-500 text-white border-none font-medium p-2  ")
                : "bg-transparent";
            calendarDates.push(
                <div key={currentDate.toISOString()} className={`text-center py-2 border border-gray-300 w-full ${color}`}>
                    {currentDate.getDate()}
                </div>
            );

            // If the current day is Saturday (6), start a new row
            if (currentDate.getDay() === 6) {
                // Push empty cells to fill the row if it's not already full
                while (calendarDates.length % 7 !== 0) {
                    calendarDates.push(
                        <div key={`empty-${calendarDates.length}`} className="text-center py-2 border border-gray-300 w-full"></div>
                    );
                }
            }
        }

        // If the last day of the month is not Saturday, add empty cells to complete the last row
        while (calendarDates.length % 7 !== 0) {
            calendarDates.push(
                <div key={`empty-${calendarDates.length}`} className="text-center py-2 border border-gray-300 w-full"></div>
            );
        }

        return (
            <div className="grid grid-cols-7 w-full">
                {dayNames.map((day, index) => (
                    <div key={index} className={`text-center ${day === 'SUN' || day === 'SAT' ? "text-red-500" : "text-slate-500"} py-2 border border-gray-300 w-full bg-slate-300 font-bold p-2`}>{day}</div>
                ))}
                {calendarDates}
            </div>
        );
    };
    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1));
    };
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Student Info" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="p-7">
                    <form action="#">
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div className="w-full sm:w-1/2">
                                <label className="mb-3 block  font-medium text-black dark:text-white"
                                    htmlFor="fullName"> Fullname</label>

                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    name="fullName"
                                    id="fullName">
                                    {Data.userdata?.full_name}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label className="mb-3 block  font-medium text-black dark:text-white"
                                    htmlFor="username">Username</label>

                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    name="username"
                                    id="username">
                                    {Data.login?.username}
                                </div>
                            </div>
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            <div className="w-full sm:w-1/3">
                                <label className="mb-3 block  font-medium text-black dark:text-white"
                                    htmlFor="mobile"> Contact Number</label>

                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    name="mobile"
                                    id="mobile">
                                    {Data.userdata?.mobile_number}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <label className="mb-3 block  font-medium text-black dark:text-white"
                                    htmlFor="email"> Email</label>

                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    name="email"
                                    id="email">
                                    {Data.login?.email}
                                </div>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <label className="mb-3 block  font-medium text-black dark:text-white"
                                    htmlFor="email">Shift</label>

                                <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    name="shift"
                                    id="shift">
                                    {Data.shiftdata?.shift_name}, {Data.shiftdata?.start_time} to {Data.shiftdata?.end_time}
                                </div>
                            </div>
                        </div>
                        <div className="mb-5.5 w-full">
                            <label className="mb-3 block  font-medium text-black dark:text-white"
                                htmlFor="mobile"> Address</label>

                            <div className="w-full rounded border border-stroke bg-slate-100 py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                name="mobile"
                                id="mobile">
                                {address}
                            </div>
                        </div>
                        <div className="mb-5.5 flex items-center justify-between">
                            <label className="text-black font-medium dark:text-white mr-3">Course Information</label>
                            <div className="flex items-center">
                                <button onClick={viewPopUp} class="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                    Add Course
                                </button>
                            </div>
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                            {Data.courseinfo &&
                                Data.courseinfo.map((course, index) => (
                                    <CourseCard key={index} course={course} />
                                ))}
                        </div>
                        <div className="mb-5.5 w-full">
                            <h2 className="text-lg text-black font-medium mb-3">Attendance</h2>
                            <center>
                            <div className=" items-center justify-between mb-3">
                                <button onClick={handlePreviousMonth} className="focus:outline-none mr-15">
                                    <IoArrowBack size={20} />
                                </button>
                                <span>{format(currentMonth, 'MMMM yyyy')}</span>
                                <button onClick={handleNextMonth} className="focus:outline-none ml-15">
                                    <IoArrowForward size={20}/>
                                </button>
                            </div>
                            </center>
                            <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #ccc", borderRadius: "5px", marginTop: "10px" }}>
                                {renderAttendanceCalendar()}
                            </div>
                        </div>

                    </form>
                </div>
                {viewPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                        <div className="bg-white p-5 rounded-md shadow-lg w-80 h-55">
                            <h2 className="text-lg font-bold mb-5">Add Course</h2>
                            <div className="mb-4">
                                <label className="mr-2">Course: <span className="text-meta-1">*</span>
                                </label>
                                <select
                                    id="course_id"
                                    value={formData.course_id}
                                    onChange={handleCourseChange}
                                    className="border rounded-md px-7 py-1"
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {levels.length > 0 && (
                                <div className="mb-4.5">
                                    <label className="mr-2">Level: <span className="text-meta-1">*</span>
                                    </label>
                                    <select
                                        name="course_level_id"
                                        value={formData.course_level_id}
                                        onChange={handleLevelChange}
                                        className="border rounded-md px-10 py-1"
                                        required
                                    >
                                        <option value="">Select Level</option>
                                        {levels.map((level) => (
                                            <option key={level.id} value={level.id}>
                                                {level.level_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {levels.length === 0 && (
                                <div className="mb-4.5">
                                    <label className="mr-2">Level: <span className="text-meta-1">*</span>
                                    </label>
                                    <select
                                        name="course_level_id"
                                        value={formData.course_level_id}
                                        onChange={handleLevelChange}
                                        disabled
                                        className="border rounded-md px-7 py-1"
                                        required
                                    >
                                        <option value="">No Levels Available</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setViewpopup(null)
                                    }
                                    className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={addNewCourse}
                                    className="mx-0 ml-5 px-3 py-1 focus:outline-none bg-blue-600 text-white hover:bg-opacity-50"
                                >
                                    Add Course
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default ViewStudent;

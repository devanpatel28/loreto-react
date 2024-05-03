import React, { useEffect, useState } from "react";
import axios from "axios";
import { FIND_COURSE_API, UPDATE_COURSEENROLL_API } from "../helper/api";
import Swal from "sweetalert2";

const CourseCard = ({ course }) => {
    const [courseName, setCourseName] = useState("");
    useEffect(() => {
        fetchCourseName(course.course_id);
    }, [course.course_id]);

    const fetchCourseName = async (course_id) => {
        try {
            const response = await axios.post(FIND_COURSE_API, {
                id: course_id,
            });
            setCourseName(response.data.data.course_name);
        } catch (error) {
            console.error("Error fetching course name:", error);
        }
    };
    const changeStatus= async (Cid,currentCourse) =>
        {
            console.log(Cid);
            Swal.fire({
                text: "Are you sure to change ?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
              }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.put(UPDATE_COURSEENROLL_API,
                        {
                            id: Cid,
                            is_current_course: !currentCourse
                        } 
                );
                  Swal.fire({
                    title: "Updated!",
                    text: "Changes successfully saved!",
                    icon: "success",
                    showConfirmButton: false,
                  });
                    window.location.reload();
                }
              });
        }
    
    return (
        <div className="w-1/2 mb-4">
            <div className="rounded-md border border-stroke bg-gray shadow-default dark:border-strokedark dark:bg-boxdark p-4">
                <div className="flex justify-between mb-2">
                    <h2 className="font-medium text-black dark:text-white">
                        Course: {courseName}
                    </h2>
                    <p
                        className={`inline-flex rounded-md bg-opacity-10 py-1 px-3 text-sm font-medium ${course.is_current_course
                                ? 'bg-green-600 text-green-800'
                                : 'bg-blue-600 text-blue-800'
                            }`}
                    >
                        {course.is_current_course ? 'Is Active' : 'Completed'}
                    </p>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <p>Enrollment Date: {course.enrollment_date}</p>
                    <div className="flex justify-end">
                        
                        <button
                        onClick={() =>changeStatus(course.id,course.is_current_course)}
                            className="mx-0 ml-5 px-3 py-1 rounded focus:outline-none bg-blue-600 text-white hover:bg-opacity-50">
                            Change
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <p>Last Month: {course.last_month}</p>
                </div>
            </div>
            
        </div>
    );
};

export default CourseCard;

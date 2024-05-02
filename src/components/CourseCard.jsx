import React, { useEffect, useState } from "react";
import axios from "axios";
import { FIND_COURSE_API } from "../helper/api";

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

    return (
        <div className="w-1/2 mb-4">
            <div className="rounded-md border border-stroke bg-gray shadow-default dark:border-strokedark dark:bg-boxdark p-4">
                <div className="flex justify-between mb-2">
                    <h2 className="font-medium text-black dark:text-white">
                        Course: {courseName}
                    </h2>
                    <p
                        className={`inline-flex rounded-md bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            course.is_current_course
                                ? 'bg-green-600 text-green-800'
                                : 'bg-blue-600 text-blue-800'
                        }`}
                    >
                        {course.is_current_course ? 'Is Active' : 'Completed'}
                    </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <p>Enrollment Date: {course.enrollment_date}</p>
                    <p>Last Month: {course.last_month}</p>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;

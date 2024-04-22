import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import {ADD_TOPIC_API, GET_COURSE_API, GET_COURSE_LEVEL_API } from "../../helper/api";
import Loader from "../../common/Loader";
import Swal from "sweetalert2";

const AddTopic = () => {
  const [formData, setFormData] = useState({
    concept_name: "",
    courseId: "",
    courseLevelId: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [levels, setLevels] = useState([]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setFormData({ ...formData, courseId, courseLevelId: "" });
    try {
      const response = await axios.post(GET_COURSE_LEVEL_API, { courseId: courseId });
      setLevels(response.data.data);
    } catch (error) {
      console.error("Error fetching course levels:", error);
      setLevels([]);
    }
  };

  const handleLevelChange = (e) => {
    setFormData({ ...formData, courseLevelId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { concept_name, courseId, courseLevelId } = formData;
      const dataToAdd = {
        concept_name: concept_name,
        courseId: courseId,
        courseLevelId: courseLevelId || null, // If no level is selected, default to 0
      };
      await axios.post(ADD_TOPIC_API, dataToAdd);
      // Clear form fields after successful submission
      setFormData({
        concept_name: "",
        courseId: "",
        courseLevelId: "",
      });
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: "Topic added successfully!",
        timer: 1000,
        width: "400px",
        showConfirmButton: false,
      });
      navigate('/manage/manage-topics')
      // Optionally, you can redirect the user to another page or show a success message here
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Topic already exists!",
        timer: 1000,
        width: "400px",
        showConfirmButton: false,
      });
      console.error("Error adding topic:", error);
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Topic" />
      <div className="flex-none mb-4 min-w-100">
        <form onSubmit={handleSubmit}>
          {loading && <Loader />}
          {!loading && (
            <div className="p-6.5 w-180">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Topic Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="concept_name"
                  value={formData.concept_name}
                  placeholder="Concept Name"
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Course Name <span className="text-meta-1">*</span>
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleCourseChange}
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
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
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Level <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="courseLevelId"
                    value={formData.courseLevelId}
                    onChange={handleLevelChange}
                    className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Level <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="courseLevelId"
                    value={formData.courseLevelId}
                    onChange={handleLevelChange}
                    disabled
                    className="w-full rounded border-[1.5px] border-gray-300 bg-gray-200 py-3 px-5 text-gray-400 outline-none transition focus:border-primary active:border-primary"
                    required
                  >
                    <option value="">No Levels Available</option>
                  </select>
                </div>
              )}
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-graydark p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Topic
              </button>
            </div>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddTopic;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import { ADD_COURSE_API } from "../../helper/api"; // Import your API endpoint
import Loader from "../../common/Loader";
import Swal from "sweetalert2"; // Import SweetAlert

const AddCoursePage = () => {
  const [formData, setFormData] = useState({
    course_name: "",
    has_levels: 1,
    time_duration: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make HTTP request to ADD_COURSE_API
      const response = await axios.post(ADD_COURSE_API, formData);
      console.log("Course added successfully:", response.data);
      // Show SweetAlert on success
      Swal.fire({
        icon: "success",
        text: "Course added successfully!",
        timer: 1000,
        width: "400px",
        showConfirmButton: false,
      });
      navigate('/manage/manage-courses')
    } catch (error) {
      console.error("Error adding course", error);
    } finally {
      setLoading(false);
      setFormData({
        course_name: "",
        has_levels: 1,
        time_duration: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Course" />
      <div className="flex-none mb-4 min-w-100">
        <form onSubmit={handleSubmit}>
          {loading && <Loader />}
          {!loading && (
            <div className="p-6.5 w-180">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Course Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="Course Name"
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Has Levels : <span className="text-meta-1">*</span>
                </label>
                <select
                  name="has_levels"
                  value={formData.has_levels}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="1">YES</option>
                  <option value="0">NO</option>
                </select>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Time Duration (MONTHS) <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  name="time_duration"
                  value={formData.time_duration}
                  onChange={handleChange}
                  placeholder="Time Duration"
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-graydark p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Course
              </button>
            </div>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddCoursePage;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import Loader from "../../common/Loader";
import Swal from "sweetalert2";
import { GET_HAS_LEVEL_COURSE_API,ADD_LEVEL_API } from "../../helper/api";

const AddLevelPage = () => {
  const [formData, setFormData] = useState({
    level_name: "",
    course_id: "",
  });
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(GET_HAS_LEVEL_COURSE_API);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make HTTP request to ADD_LEVEL_API
      const response = await axios.post(ADD_LEVEL_API, formData);
      console.log("Level added successfully:", response.data);
      // Show SweetAlert on success
        Swal.fire({
          icon: "success",
          text: "Level added successfully!",
          timer: 1000,
          width: "400px",
          showConfirmButton: false,
        });
        navigate('/manage/manage-levels')
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Level already exists!",
        timer: 1000,
        width: "400px",
        showConfirmButton: false,
      });
      console.error("Error adding level", error);
    } finally {
      setLoading(false);
      setFormData({
        level_name: "",
        course_id: "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Level" />
      <div className="flex-none mb-4 min-w-100">
        <form onSubmit={handleSubmit}>
          {loading && <Loader />}
          {!loading && (
            <div className="p-6.5 w-180">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Level Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="level_name"
                  value={formData.level_name}
                  onChange={handleChange}
                  placeholder="Level Name"
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Select Course : <span className="text-meta-1">*</span>
                </label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
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

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-graydark p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Level
              </button>
            </div>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddLevelPage;

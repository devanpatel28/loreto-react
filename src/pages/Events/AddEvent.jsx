import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css";
import { ADD_LOGIN_API, ADD_COURSEENROLL_API, ADD_STUDENT_API, GET_COURSE_API, GET_COURSE_LEVEL_API, GET_SHIFT_API, GET_USER_ID, MAIL_API, ADD_EVENT_API } from "../../helper/api"; // Import your API endpoint
import Loader from "../../common/Loader";
import Swal from "sweetalert2"; // Import SweetAlert

const AddEvent = () => {
  const [formData, setFormData] = useState({
    event_description: "",
    event_date: new Date(),
    shiftdatum_id: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    async function fetchShift() {
      try {
        const response = await axios.get(GET_SHIFT_API);
        setShifts(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchShift();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { shiftdatum_id, event_description, event_date } = formData;
    try {
      const addEvent = await axios.post(ADD_EVENT_API, {
        event_description: event_description,
        event_date: event_date,
        shiftdatum_id: shiftdatum_id,
      });

      Swal.fire({
        icon: "success",
        text: "Event added successfully!",
        width: "400px",
        timer: 1000,
        showConfirmButton: false,
      });
      setFormData({
        event_description: "",
        event_date: new Date(),
        shiftdatum_id: "",
      });
      navigate('/events')
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        width: "400px",
        timer: 1000,
        showConfirmButton: false,
      });
      console.error("Error adding student:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShiftChange = (e) => {
    setFormData({ ...formData, shiftdatum_id: e.target.value });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Event" />
      <div className="flex-none mb-4 min-w-100">
        <form onSubmit={handleSubmit}>
          {loading && <Loader />}
          {!loading && (
            <div className="p-6.5 w-180">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Event Description <span className="text-meta-1">*</span>
                </label>
                <textarea
                  type="text"
                  name="event_description"
                  value={formData.event_description}
                  onChange={handleChange}
                  placeholder="Event Description"
                  className="w-full min-h-30 rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Event Date <span className="text-meta-1">*</span>
                </label>
                <DatePicker
                  selected={formData.event_date}
                  onChange={(date) =>
                    setFormData({ ...formData, event_date: date })
                  }
                  dateFormat="dd/MM/yyyy"
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Select Shift <span className="text-meta-1">*</span>
                </label>
                <select
                  name="shiftdatum_id"
                  value={formData.shiftdatum_id}
                  onChange={handleShiftChange}
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Shift</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shift_name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-graydark p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Event
              </button>
            </div>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddEvent;
import React, { useState,useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa, FcNumericalSorting12, FcNumericalSorting21 } from "react-icons/fc";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { GET_TEACHER_API } from "../../helper/api";

const TeacherPage = () => {
    const [search, setSearch] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('full_name');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [Data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_TEACHER_API);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const [order,setOrder] = useState("ASC");
    const [number,setNumber] = useState("ASC");
  
    const sorting = (col) => {
      if(order === "ASC")
      {
        const sorted = [...Data].sort((a,b) => a[col]> b[col] ? 1 : -1);
        setData(sorted);
        setOrder("DSC");
      }
  
      if(order === "DSC")
      {
        const sorted = [...Data].sort((a,b) => a[col]< b[col] ? 1 : -1);
        setData(sorted);
        setOrder("ASC");
      }
    }
  
    const sortingNumbers = (col) => {
        console.log("Sorting numbers column:", col);
        const sortedData = [...Data];
            if (number === "ASC") {
                sortedData.sort((a, b) => a[col] > b[col] ? 1 : -1);
                setNumber("DSC");
            } else {
                sortedData.sort((a, b) => a[col] < b[col] ? 1 : -1);
                setNumber("ASC");
            }
        console.log("Sorted data:", sortedData);
        setData(sortedData);
    };
    

    

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const currentItems = Data.slice(indexOfFirstItem, indexOfLastItem);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Teachers" />
            <div className="flex justify-normal items-center mb-4 w-50">
                <div>
                    <NavLink to="/add-teacher">
                    <button onClick={() => setShowModal(true)}
                        class="min-w-50 inline-flex items-center justify-center gap-2.5 bg-graydark py-3 border-2 text-center font-medium text-white duration-200 ease-in-out hover:bg-opacity-0 hover:text-graydark hover:border-2"
                    >
                        <IoAdd size={30} />
                        Add Teacher
                    </button>
                    </NavLink>
                </div>
                <form className="flex items-center ml-10">
                    <input
                        type="text"
                        placeholder="Search Teacher"
                        className="border w-100 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        className="border ml-2 rounded-sm border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="full_name">Name</option>
                        <option value="mobile">Mobile</option>
                        <option value="email">Email</option>
                    </select>
                </form>
                <div className="flex ml-20">
                    <label className="min-w-25 mr-2 mt-2.5">Show entries:</label>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border rounded-sm border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-3 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">

                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th onClick={() => sortingNumbers("id")} className="min-w-10 py-4 px-2 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        No
                                        {number === 'ASC' ? <FcNumericalSorting21 /> : <FcNumericalSorting12 />}
                                    </span>
                                </th>
                                <th onClick={() => sorting("full_name")} className="min-w-[20px] py-4 px-4 font-medium text-black dark:text-white ">
                                <span className="flex items-center gap-1">
                                    Name
                                    {order === 'ASC' ? <FcAlphabeticalSortingZa /> : <FcAlphabeticalSortingAz />}
                                </span>
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Mobile
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Email Id
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Type
                            </th>
                            <th onClick={() => sortingNumbers("isActive")} className="min-w-10 py-4 font-medium text-black dark:text-white ">
                                <span className="flex items-center gap-1">
                                    Status
                                    {number === 'ASC' ? <FcNumericalSorting21 /> : <FcNumericalSorting12 />}
                                </span>
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentItems.filter((teacher) => {
                                if (searchCriteria === 'full_name') {
                                    return search === '' ? teacher : teacher.userdata.full_name.toLowerCase().includes(search.toLowerCase());
                                }
                                if (searchCriteria === 'mobile') {
                                    return search === '' ? teacher : teacher.userdata.mobile_number.toLowerCase().includes(search.toLowerCase());
                                }
                                if (searchCriteria === 'email') {
                                    return search === '' ? teacher : teacher.userdata.email.toLowerCase().includes(search.toLowerCase());
                                }
                                return search === '' ? teacher : teacher.userdata.full_name.toLowerCase().includes(search.toLowerCase());
                            }).map((teacher, key) => (
                            <tr key={key}>
                                <td className="border-b border-[#eee] py-5 px-4  dark:border-strokedark ">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {teacher.userdata.id}
                                    </h5>

                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <h5 className="font-medium text-black dark:text-white">
                                        {teacher.userdata.full_name}
                                    </h5>

                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {teacher.userdata.mobile_number}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {teacher.userdata.email}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">
                                        {teacher.login.type}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p
                                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                                            teacher.login.isActive == 1
                                                ? 'bg-success text-success'
                                                : 'bg-danger text-danger'
                                        }`}
                                    >
                                        {teacher.login.isActive == 1 ? 'Active' : 'Inactive'}
                                    </p>
                                </td>
                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <div className="flex items-center space-x-3.5">

                                        <button className="hover:text-primary">
                                            <MdEdit color="#0000FF" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <div className="flex justify-center mt-4 mb-4">
                {/* Previous Button */}
                <button
                    onClick={() => paginate(currentPage - 1)}
                    className={`mx-1 px-3 py-1 focus:outline-none 
                    ${currentPage === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-graydark text-white hover:bg-opacity-90'}`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {/* Pagination Buttons */}
                {[...Array(Math.ceil(Data.length / itemsPerPage)).keys()].map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number + 1)}
                        className={`mx-1 px-3 py-1 squ-full focus:outline-none 
                        ${currentPage === number + 1 ? 'rounded-md bg-graydark text-white' : 'bg-gray-300 text-gray-700 hover:bg-opacity-90'}`}
                    >
                        {number + 1}
                    </button>
                ))}

                {/* Next Button */}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    className={`mx-1 px-3 py-1 focus:outline-none 
                    ${currentPage === Math.ceil(Data.length / itemsPerPage) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-graydark text-white hover:bg-opacity-90'}`}
                    disabled={currentPage === Math.ceil(Data.length / itemsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    </DefaultLayout>
);
};

export default TeacherPage;


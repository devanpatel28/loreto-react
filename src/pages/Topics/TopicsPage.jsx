    import React, { useState, useEffect } from "react";
    import {NavLink } from "react-router-dom";
    import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
    import DefaultLayout from "../../layout/DefaultLayout";
    import { IoAdd } from "react-icons/io5";
    import axios from "axios";
    import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from "react-icons/fc";
    import { GET_LEVEL_API, FIND_COURSE_API, GET_TOPIC_API, FIND_COURSELEVELS_API, CHANGE_TOPIC_API } from "../../helper/api";
    import Swal from "sweetalert2";

    const TopicsPage = () => {
        const [search, setSearch] = useState('');
        const [currentPage, setCurrentPage] = useState(1);
        const [itemsPerPage, setItemsPerPage] = useState(5);
        const [data, setData] = useState([]);
        const [editLevelId, setEditTopicId] = useState(null);
        const [editLevelName, setEditTopicName] = useState("");
        const [courseNames, setCourseNames] = useState({});
        const [levelNames, setLevelNames] = useState({});
        const [sortBy, setSortBy] = useState('');
        const [sortOrder, setSortOrder] = useState('');
        const [sortByLevelName, setSortByLevelName] = useState('');
        const [sortOrderLevelName, setSortOrderLevelName] = useState('');
        const [sortByCourseName, setSortByCourseName] = useState('');
        const [sortOrderCourseName, setSortOrderCourseName] = useState('');
        const [searchCriteria, setSearchCriteria] = useState('concept_name');


        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get(GET_TOPIC_API);
                    setData(response.data.data);
                    console.log(response.data.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }, []);

        useEffect(() => {
            // Fetch course names for each concept
            data.forEach((concept) => {
                fetchCourseName(concept.course_id);
                if(concept.course_level_id===null){
                    setLevelNames(prevState => ({
                        ...prevState,
                        [concept.course_level_id]: 'No Level'
                    }));
                }
                else
                {
                    fetchLevelName(concept.course_level_id);
                }
            });
        }, [data]);

        const fetchCourseName = async (course_id) => {
            try {
                const response = await axios.post(FIND_COURSE_API, {
                    id: course_id,
                });
                setCourseNames(prevState => ({
                    ...prevState,
                    [course_id]: response.data.data.course_name
                }));
            } catch (error) {
                console.error("Error fetching course name:", error);
            }
        };

        const fetchLevelName = async (course_level_id) => {
            try {
                const response = await axios.post(FIND_COURSELEVELS_API, {
                    id: course_level_id,
                });
                setLevelNames(prevState => ({
                    ...prevState,
                    [course_level_id]: response.data.data.level_name
                }));
            } catch (error) {
                console.error("Error fetching course name:", error);
            }
        };

        const handleItemsPerPageChange = (e) => {
            setItemsPerPage(parseInt(e.target.value, 10));
            setCurrentPage(1);
        };


        const handleSaveChanges = async () => {
            try {
                // Make the HTTP request to update the concept
                await axios.put(CHANGE_TOPIC_API, {
                    id: editLevelId,
                    concept_name: editLevelName,
                });
                Swal.fire({
                    icon: "success",
                    text: "Changes saved successfully!",
                    timer: 1000,
                    width: "400px",
                    showConfirmButton: false,
                });
        
                // Refetch data after saving changes
                const response = await axios.get(GET_TOPIC_API);
                setData(response.data.data);
            } catch (error) {
                console.error("Error updating concept:", error);
                Swal.fire({
                    icon: "error",
                    text: "Level name already exists!",
                    timer: 1000,
                    width: "400px",
                    showConfirmButton: false,
                });
                // Handle error
            } finally {
                setEditTopicId(null);
                setEditTopicName("");
            }
        };
        

        const editLevel = (id) => {
            const concept = data.find((concept) => concept.id === id);
            if (concept) {
                setEditTopicId(id);
                setEditTopicName(concept.concept_name);
            }
        };

        const paginate = (pageNumber) => {
            setCurrentPage(pageNumber);
        };

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
        // Function to handle sorting by column
        const handleSort = (column) => {
            if (column === 'concept_name') {
                if (sortBy === column) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                    setSortBy(column);
                    setSortOrder('asc');
                }
            } else if (column === 'level_name') {
                if (sortByLevelName === column) {
                    setSortOrderLevelName(sortOrderLevelName === 'asc' ? 'desc' : 'asc');
                } else {
                    setSortByLevelName(column);
                    setSortOrderLevelName('asc');
                }
            } else if (column === 'course_name') {
                if (sortByCourseName === column) {
                    setSortOrderCourseName(sortOrderCourseName === 'asc' ? 'desc' : 'asc');
                } else {
                    setSortByCourseName(column);
                    setSortOrderCourseName('asc');
                }
            } else {
                // Handle sorting for other columns if needed
            }
        };

        const sortedData = data.sort((a, b) => {
            if (sortBy === 'concept_name') {
                if (sortOrder === 'asc') {
                    return a.concept_name.localeCompare(b.concept_name);
                } else {
                    return b.concept_name.localeCompare(a.concept_name);
                }
            } else if (sortBy === 'course_name') {
                if (sortOrder === 'asc') {
                    return (courseNames[a.course_id] || '').localeCompare(courseNames[b.course_id] || '');
                } else {
                    return (courseNames[b.course_id] || '').localeCompare(courseNames[a.course_id] || '');
                }
            } else if (sortByLevelName === 'level_name') {
                if (sortOrderLevelName === 'asc') {
                    return (levelNames[a.course_level_id] || '').localeCompare(levelNames[b.course_level_id] || '');
                } else {
                    return (levelNames[b.course_level_id] || '').localeCompare(levelNames[a.course_level_id] || '');
                }
            } else {
                return 0;
            }
        });

        // Function to render sorting icons based on sort order
        const renderSortIcon = (column) => {
            if (sortBy === column) {
                return sortOrder === 'asc' ? <FcAlphabeticalSortingAz /> : <FcAlphabeticalSortingZa />;
            } else {
                // Return default sorting icon if no sorting is applied to this column
                return <FcAlphabeticalSortingAz />;
            }
        };

        const filteredData = data.filter((concept) => {
            if (searchCriteria === 'concept_name') {
                return search === '' ? true : concept.concept_name.toLowerCase().includes(search.toLowerCase());
            }
            if (searchCriteria === 'level_name') {
                return search === '' ? true : levelNames[concept.course_level_id].toLowerCase().includes(search.toLowerCase());
            }
            if (searchCriteria === 'course_name') {
                return search === '' ? true : courseNames[concept.course_id].toLowerCase().includes(search.toLowerCase());
            }
            return search === '' ? true : concept.concept_name.toLowerCase().includes(search.toLowerCase());
        });

        return (
            <DefaultLayout>
                <Breadcrumb pageName="Topics" />
                <div className="flex justify-normal items-center mb-4 w-50">
                    <div>
                        <NavLink to="/add-topics">
                            <button onClick={() => setShowModal(true)}
                                class="min-w-50 inline-flex items-center justify-center gap-2.5 bg-graydark py-3 border-2 text-center font-medium text-white duration-200 ease-in-out hover:bg-opacity-0 hover:text-graydark hover:border-2"
                            >
                                <IoAdd size={30} /> 
                                Add Topic
                            </button>
                        </NavLink>
                    </div>
                    <form className="flex items-center ml-10">
                    <input
                        type="text"
                        placeholder={
                            searchCriteria==="concept_name"?"Search Topic"
                            :searchCriteria==="level_name"?"Search Level"
                            :"Seach Course"}
                        className="border w-100 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        className="border ml-2 rounded-sm border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="concept_name">Topic</option>
                        <option value="level_name">Level</option>
                        <option value="course_name">Course</option>
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
                                <tr className="bg-red-50 text-left dark:bg-meta-4">
                                    <th className="min-w-10 py-4 px-2 font-medium text-black dark:text-white ">
                                        <span className="flex items-center gap-1">
                                            Topic ID
                                        </span>
                                    </th>
                                    <th className="min-w-[20px] py-4 px-2 font-medium text-black dark:text-white ">
                                        <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('concept_name')}>
                                            Topic Name
                                            {renderSortIcon('concept_name')}
                                        </span>
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('level_name')}>
                                            Level Name
                                            {renderSortIcon('level_name')}
                                        </span>
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('course_name')}>
                                            Course Name
                                            {renderSortIcon('course_name')}
                                        </span>
                                    </th>

                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((concept, key) => (
                                    <tr key={key}>
                                        <td className="border-b border-[#eee] py-5 px-5  dark:border-strokedark ">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {concept.id}
                                            </h5>

                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {concept.concept_name}
                                            </h5>

                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-7 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {levelNames[concept.course_level_id] || 'Loading...'}
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-7 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {courseNames[concept.course_id] || 'Loading...'}
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <button onClick={() => editLevel(concept.id)} class="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                                    Edit
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
                        {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map((number) => (
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
                            ${currentPage === Math.ceil(data.length / itemsPerPage) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-graydark text-white hover:bg-opacity-90'}`}
                            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                        >
                            Next
                        </button>
                    </div>

                </div>
                {editLevelId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-md shadow-lg w-96">
                            <h2 className="text-lg font-bold mb-5">Edit Topic Name</h2>
                            <div className="mb-4">
                                <label htmlFor="conceptname" className="block mb-2 font-semibold">Level Name: </label>
                                <input
                                    type="text"
                                    id="conceptname"
                                    value={editLevelName}
                                    onChange={(e) => setEditTopicName(e.target.value)}
                                    className="border rounded-md px-3 py-2 w-full"
                                    placeholder="Enter Topic Name"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setEditTopicId(null);
                                        setEditTopicName("");
                                    }}
                                    className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="mx-0 ml-5 px-3 py-1 focus:outline-none bg-blue-600 text-white hover:bg-opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </DefaultLayout>
        );
    };

    export default TopicsPage;


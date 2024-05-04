import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Navigate, useLocation ,useNavigate} from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/Loreto.png';
import { HiOutlineLogout, HiOutlineViewGrid } from 'react-icons/hi'
import { FaBook, FaBuilding, FaChevronDown, FaGraduationCap, FaRegListAlt, FaUserAlt ,FaUsers} from "react-icons/fa";
import { IoIosChatboxes, IoIosPeople, IoIosPerson, IoIosSunny, IoIosTrophy, IoMdAdd, IoMdMedal, IoMdPaper, IoMdSettings, IoMdTrophy } from "react-icons/io";
import { CgFileDocument } from "react-icons/cg";
import { RiListSettingsFill } from "react-icons/ri";
import { RiKey2Line } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import Swal from 'sweetalert2';
import { underDev } from '../../helper/alert';



const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? true : storedSidebarExpanded === 'true'
  );
  const navigate = useNavigate();
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);
  
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure to Logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/');
      }
    });
  };
  return (
    <>
    
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 'translate-x-0'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex flex-row items-center justify-between gap-2 px-6 py-5">
        <NavLink to="/dashboard">
          <img src={Logo} alt="Logo" />
        </NavLink>

      </div>
      
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:text-white hover:bg-graydark hover:text-white dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <HiOutlineViewGrid size={22} strokeWidth={1.4} />
                  Dashboard
                </NavLink>
              </li>

              <h3 className="flex flex-row gap-2.5 mt-3 ml-4 text-sm font-semibold text-bodydark2">
              {/* <RiListSettingsFill size={22} /> */}
              Manage
            </h3>
            
              
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/manage' || pathname.includes('manage')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:text-white dark:hover:bg-meta-4 
                          ${(pathname === '/manage-cources') &&
                            'bg-graydark text-white'
                            }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className='flex w-[22px] justify-center'>
                          <IoMdPaper  size={23} />
                        </div>
                        Manage Course
                        <FaChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${open && 'rotate-180'}`} />
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/manage/manage-courses"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-graydark ' +
                                (isActive && '!text-graydark')
                              }
                            >
                              <IoMdSettings size={20} />
                              Manage Courses
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/manage/manage-levels"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-graydark ' +
                                (isActive && '!text-graydark')
                              }
                            >
                              <IoMdSettings size={20} />
                              Manage Levels
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/manage/manage-topics"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-graydark ' +
                                (isActive && '!text-graydark')
                              }
                            >
                              <IoMdSettings size={22} />
                              Manage Topics
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <li>
                <NavLink
                  to="/manage-student"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:text-white dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                    <IoIosPerson size={23} />
                  Students
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/teachers"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:text-white dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                    <IoIosPeople size={23} />
                  Teachers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/chats"
                >
                    
                  <button className={`group relative flex w-full  items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:text-white dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}><IoIosChatboxes size={25} /> Chat</button>
                </NavLink>
              </li>
            
              <li>
                <NavLink
                  to="/holidays"
                >
                    
                  <button className={`group relative flex w-full  items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:text-white dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}><IoIosSunny size={25} /> Holiday</button>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/events">
                    <button className={`group relative flex w-full  items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark hover:text-white dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}><IoIosTrophy size={23} /> Events</button>
                </NavLink>  
              </li>
              <li>
                <button onClick={handleLogout} className={`group relative w-full flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 text-red-500 duration-300 ease-in-out hover:bg-graydark hover:text-white dark:hover:bg-meta-4 ${pathname.includes('logout') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}>
                  <div className='flex w-[22px] justify-center'>
                    <HiOutlineLogout size={22} />
                  </div>
                  Logout
                </button>
              </li>

              {/* <!-- Menu Item Dashboard --> */}
            </ul>
          </div>
  
        </nav>
        
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

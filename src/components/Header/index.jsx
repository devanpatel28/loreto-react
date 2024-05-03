import { Link } from 'react-router-dom';

import LogoIcon from '../../images/logo/logo-icon.svg';
import { useEffect, useState } from 'react';


const Header = () => {
  const [userdata,setUserdata] = useState([]);

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("userdata"));
   setUserdata(temp);
    console.log(typeof(temp));
    
  }, [])

  const fullname = userdata.full_name;
  return (
    <header className="h-15 top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
  <div className="h-15 flex items-center justify-between w-full">
    <div className="flex items-center gap-4">
      <span className="ml-5 text-m font-medium text-black">
      Welcome, 
        <span className="ml-1 text-m text-graydark dark:text-white">
           {fullname}
        </span>
      </span>
      </div>
    </div>
    </header>
  );
};

export default Header;

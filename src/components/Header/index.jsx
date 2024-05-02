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
    <header className="sticky h-15 top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
     <div className="relative flex items-center justify-between w-full">
      <div className='flex items-center gap-4'>
        <span className="hidden text-right lg:block">
          <span className="block text-m font-medium text-black dark:text-white">
            {fullname}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg 
                version="1.1" 
                id="Layer_1"
                width="25"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 64 64"
                fill="#386ed9 "
                >
                <g>
                  <path class="st0" d="M43.6,55.5c3.1-0.1,5.6-2.7,5.5-5.9c0-0.7-0.2-1.4-0.5-2.1c-3.5-8.8-9.7-14.6-16.8-14.6s-13.1,5.7-16.6,14.3
                    c-1.3,2.9,0,6.3,2.9,7.5c0.6,0.3,1.3,0.4,2,0.5L43.6,55.5z"/>
                  <circle class="st0" cx="32" cy="18.4" r="9.9"/>
                </g>
            </svg>
          </div>  
        </span>
      </div>
    </div>
    </header>
  );
};

export default Header;

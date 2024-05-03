import React, { ReactNode } from 'react';


const CardDataStats = ({
  title,
  total,
  children,
}) => {
  return (
    <div className=" h-30 w-60  transform hover:scale-105 duration-200 ease-in-out rounded-md border border-stroke bg-white py-4 px-7 shadow-default dark:border-strokedark dark:bg-boxdark">
      <center>
      <div className="flex h-13 w-13 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>      
      </center>
      <center>
      <div className="mt-1.5">
        <div>
          <span className="mr-2 text-title-md font-bold text-black dark:text-white">{total}</span>
          <span className="text-lg   font-semibold">{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium`}
        >
        </span>
      </div>
      </center>
     
    </div>
  );
};

export default CardDataStats;

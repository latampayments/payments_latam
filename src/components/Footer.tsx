import Link from 'next/link';
import Image from 'next/image';

const Navbar = async () => {
  return (
    <>
      <div className='bg-[#132C33] w- flex flex-col'>
        <div className='flex flex-row items-center justify-left m-4 p-4'>
          <p className='pr-2 mr-2 text-white text-sm font-thin'>@2022 Latam Payments All rights reserved</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;

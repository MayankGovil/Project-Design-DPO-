import React, { useContext } from 'react'
import Header from '../Common/Header'
import Sidebar from '../Common/Sidebar'
import { mainContext } from '../Context'
import DashboardItems from '../Common/DashboardItems';
import Footer from '../Common/Footer';

function Dashboard(){
  let {changemenu} = useContext(mainContext);
  
  return (
    <>
    <Header/>
    
    <div className='flex  bg-[#F5F7FF]'>
      <Sidebar/>
      
      <div className={` ${changemenu==true ? 'w-[95%]':'w-[84%]'} relative px-[30px] py-[50px] h-[92vh] bg-[#F5F7FF]`}>

        <h1 className='text-[25px] font-[500] mb-[30px]'>
        Welcome To Admin Panel
        </h1>
        <div className='grid grid-cols-4 gap-5'>
          <DashboardItems/>
        </div>
      <Footer/>
      </div>
    </div>
    
    </>
  )
}

export default Dashboard
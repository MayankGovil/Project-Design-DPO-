import React from 'react'
import { dashboardData } from './DashboardData'

function DashboardItems() {
    let ddata = dashboardData;
  return (
    <>
    {
      ddata.map(v=>{
        console.log(v.color)
        return(
            <div className={`w-full px-[15px] py-[18px] rounded-[20px] text-white `} style={{background:v.color}}>
            <h3 className=''>Today’s Bookings</h3>
            <h1 className='text-[35px]'>4006</h1>
            <p>10.00% (30 days)</p>
        </div>
        )
      })  
    }
       
    </>
  )
}

export default DashboardItems
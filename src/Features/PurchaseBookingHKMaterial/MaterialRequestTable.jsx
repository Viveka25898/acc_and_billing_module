/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MaterialRequestTable = () => {
    const navigate=useNavigate()
  const [requests]=useState([
    {
        id: "REQ-101",
      requester: "Site Manager A",
      site: "Site Alpha",
      material: "Cement",
      quantity: "100",
      unit: "Bags",
      expectedDate: "2025-06-05",
      deliveryLocation: "Alpha Warehouse",
    },{
        id: "REQ-102",
        requester: "Site Manager B",
        site: "Site Beta",
        material: "Steel Rods",
        quantity: "500",
        unit: "Kg",
        expectedDate: "2025-06-07",
        deliveryLocation: "Beta Storage",
      },

  ])

  const handleGenerateDC=(req)=>{
    navigate("/dashboard/vendor/dc-form")
  }
    return (
    <>
        <div className='p-4 sm:p-6 lg:p-8 bg-white shadow-md'>
            <h2 className='text-xl sm:text-2xl font-semibold mb-6 text-green-600'>Material Requests</h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border border-gray-300 rounded-md'>
                    <thead className='bg-gray-200 '>
                        <tr>
                            <th className='px-4 py-2 border'>Requester</th>
                            <th className='px-4 py-2 border'>Site</th>
                            <th className='px-4 py-2 border'>Material</th>
                            <th className='px-4 py-2 border'>Qty</th>
                            <th className='px-4 py-2 border'>Expected Date</th>
                            <th className='px-4 py-2 border'>Deliver Location</th>
                            <th className='px-4 py-2 border'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            requests.map((req)=>(
                                <tr key={req.id}
                                className='text-center'
                                >
                                    <td className="px-4 py-2 border">{req.requester}</td>
                                    <td className="px-4 py-2 border">{req.site}</td>
                                    <td className="px-4 py-2 border">{req.material}</td>
                                    <td className="px-4 py-2 border">{req.quantity} {req.unit}</td>
                                    <td className="px-4 py-2 border">{req.expectedDate}</td>
                                    <td className="px-4 py-2 border">{req.deliveryLocation}</td>
                                    <td className='px-4 py-2 border '>
                                        <button
                                        onClick={()=>handleGenerateDC(req)}
                                        className='bg-green-600 text-white px-2  rounded hover:bg-green-700 cursor-pointer'
                                        >
                                            Generate DC
                                        </button>
                                    </td>

                                </tr>

                            ))
                        }
                    </tbody>
                </table>

            </div>

        </div>
    </>
  )
}

export default MaterialRequestTable
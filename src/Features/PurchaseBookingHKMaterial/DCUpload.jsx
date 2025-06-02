/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const DCUpload = () => {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        location: "",
        poNumber: "",
        dcNumber: "",
        dcDate: "",
        dcFile: null,
        remarks: "",
        status: "pending"
    })
    const [error,setError]=useState("")
    const vednorLocations=["Hyderabad","Bangalore","Chennai","Delhi","Mumbai","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow"]
    
    const handleChange = (e) => {
        const {name,value,files}=e.target
        if(name==="dcFile"){
            setFormData((prev)=>({...prev,dcFile:files[0]}))
        } 
            else{
                setFormData((prev)=>({...prev,[name]:value}))
            }
    }

    const validate=()=>{
        const {location, poNumber, dcNumber, dcDate, dcFile}=formData;
        if(!location || !poNumber || !dcNumber || !dcDate || !dcFile){
            setError("All fields must be filled.")
            return false;
        }
        const validTypes=['application/pdf','image/jpeg','image/png']
        if(!validTypes.includes(dcFile.type)){
            return "File must be PDF or Image (JPG/PNG"
        }

        if(dcFile.size > 5 * 1024 * 1024){
            return "File Size must be under 5MB"
        }
    return "";
    }


        //Handle Submit
        const handleSubmit=(e)=>{
            e.preventDefault();
            //Error Checking
            const err=validate()
            if(err){
                setError(err)
                return ;
            }
            setError("")

            //Local Storage
            const dcList=JSON.parse(localStorage.getItem("vendor-dc-data")) || [];
            const newDC={
                id:Date.now(),
                ...formData,
                fileName:formData.dcFile.name,
            }
            dcList.push(newDC)
            localStorage.setItem("vendor-dc-data",JSON.stringify(dcList));
            toast.success("Delivery Challan Uploaded Successfully!");
            //Reset Form
            setFormData({
                location: "",
                poNumber: "",
                dcNumber: "",
                dcDate: "",
                dcFile: null,
                remarks: "",
                status: "pending"
            });


        }

  return (
    <>
    <div className='max-w-4xl mx-autop-4 mt-6 bg-white shadow-md rounded-lg'>
        <h2 className='text-2xl font-bold mb-4 text-center text-green-700'>Upload Delivery Challan</h2>
        {error && <p className='text-red-600 text-sm mb-2'>{error}</p>}
        
        <form
        className='bg-white shadow-md rounded-lg p-6 space-y-4'
        onSubmit={handleSubmit}
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                
                <div>
                    <label className='block font-medium' >Location</label>
                    <select name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className='w-full border rounded px-3 py-2'
                    required
                    >
                        <option value="">Select Location</option>
                        {
                            vednorLocations.map((loc)=>(
                                <option key={loc} value={loc}>{loc}</option>
                            ))
                        }
                    </select>
                </div>
                
                <div>
                <label className='block font-medium' >PO Number</label>
                    <input type="text"
                    name='poNumber'
                    value={formData.poNumber}
                    onChange={handleChange}
                    className='w-full border rounded px-3 py-2'
                    required
                    placeholder='Enter PO Number'
                    />
                </div>
                
                <div>       
                <label className='block font-medium' >DC Number</label>
                    <input type="text"
                    name='dcNumber'
                    value={formData.dcNumber}
                    onChange={handleChange}
                    className='w-full border rounded px-3 py-2'
                    required
                    placeholder='Enter DC Number'
                    />
                </div>
                
                
                <div>
                <label className='block font-medium' >DC Date</label>
                    <input type="date"
                    name='dcDate'
                    value={formData.dcDate}
                    onChange={handleChange}
                    className='w-full border rounded px-3 py-2'
                    required
                    placeholder='Enter PO Number'
                    />
                </div>

                 <div>
                <label className='block font-medium' >Remarks</label>
                    <textarea 
                    name='remarks'
                    value={formData.remarks}
                    onChange={handleChange}
                    className='w-full border rounded px-3 py-2'
                    placeholder='Enter any remarks or additional information'
                    rows={3}
                    ></textarea>
                </div>

                <div>
                <label className='block font-medium' > Upload DC File (PDF/Image)</label>
                    <input type="file"
                    
                    onChange={handleChange}
                    name='dcFile'
                    accept='application/pdf,image/*'
                    className='w-full border rounded px-3 py-2'
                    required
                    />
                </div>

               

                <div className='text-right'>
                        <button 
                        type='submit'
                        className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition'>
                            Upload DC
                        </button>
                </div>

            </div>

        </form>


    </div>
    </>
  )
}

export default DCUpload
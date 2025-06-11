/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Input from './UIComponents/Input'
import Select from './UIComponents/Select'
import { useNavigate } from 'react-router-dom'

const VendorCreationForm = () => {
    const [formData,setFormData]=useState({
        vendorName: '',
        gstin: '',
        pan: '',
        expenseType: '',
        tdsRate: '',
        vendorType: '',
        address: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
    })
    const [errors,setErrors]=useState({})
    const[submitted,setSubmitted]=useState(null)

    const allowedVendorTypes = ['General Services', 'Consulting', 'Other'];
    const navigate=useNavigate()

    //Error Handling Function
    const validateForm=()=>{
        const newErrors={}
        const gstRegex = /^[0-9A-Z]{15}$/;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!formData.vendorName.trim()) newErrors.vendorName="Vednor name is Required"
        if (!gstRegex.test(formData.gstin)) newErrors.gstin = 'GSTIN must be 15 characters';
        if (!panRegex.test(formData.pan)) newErrors.pan = 'PAN must be valid';
        if (!formData.expenseType) newErrors.expenseType = 'Select nature of expense';
        if (formData.tdsRate < 0 || formData.tdsRate > 30 || formData.tdsRate === '')
        newErrors.tdsRate = 'TDS rate must be between 0-30';
        if (!formData.vendorType) newErrors.vendorType = 'Select vendor type';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
        if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
        if (!emailRegex.test(formData.email)) newErrors.email = 'Email is invalid';
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0        
        }

        //Handle Change Function
        const handleChange=(e)=>{
            const {name,value}=e.target
            setFormData((prev)=>({...prev,[name]:value}))
        }

        //Handle Submit Function
        const handleSubmit=(e)=>{
            e.preventDefault()
            if(validateForm()){
                setSubmitted(true)
                console.log("Vendor Created Successfully",formData)
                setFormData({
                     vendorName: '',
                    gstin: '',
                    pan: '',
                    expenseType: '',
                    tdsRate: '',
                    vendorType: '',
                    address: '',
                    contactPerson: '',
                    contactNumber: '',
                    email: '',
                });
                setErrors({})
            }

        }


  return (
   <>
   <div
   className='"w-full bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded shadow-md mb-4 text-center animate-pulse'
   >
    AE can only Create a Vendors Other than Materials and Uniforms. It will be Created By Procurement Team.
   </div>
   <div className='max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6'>
    <button
    onClick={()=>navigate("/dashboard/ae/vendor-list")}
    >Vendors List</button>
        <h2 className='text-2xl font-bold mb-4 text-green-600'>Vendor Creation Form</h2>
        <form className='grid gird-cols-1 md:grid-cols-2 gap-6' onSubmit={handleSubmit}>
            <Input name="vendorName" label="Vendor Name" value={formData.vendorName} onChange={handleChange} error={errors.vendorName}/>
            <Input name="gstin" label="GSTIN" value={formData.gstin} onChange={handleChange} error={errors.gstin} />
            <Input name="pan" label="PAN Number" value={formData.pan} onChange={handleChange} error={errors.pan} />
            <Input name="tdsRate" label="TDS Rate (%)" type="number" value={formData.tdsRate} onChange={handleChange} error={errors.tdsRate} />

            <Select name="expenseType" label="Nature of Expense" value={formData.expenseType} onChange={handleChange} error={errors.expenseType}>
            <option value="">Select</option>
            <option value="Consulting">Consulting</option>
            <option value="General Services">General Services</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Other">Other</option>
            </Select>

            <Select name="vendorType" label="Vendor Type" value={formData.vendorType} onChange={handleChange} error={errors.vendorType}>
            <option value="">Select</option>
            {allowedVendorTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
            </Select>

            <Input name="address" label="Address" value={formData.address} onChange={handleChange} error={errors.address} />
            <Input name="contactPerson" label="Contact Person" value={formData.contactPerson} onChange={handleChange} error={errors.contactPerson} />
            <Input name="contactNumber" label="Contact Number" value={formData.contactNumber} onChange={handleChange} error={errors.contactNumber} />
            <Input name="email" label="Email" value={formData.email} onChange={handleChange} error={errors.email} />

            <div className='md:col-span-2 flex justify-end'>
                <button
                type='submit'
                className='bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-2 rounded shadow-md font-semibold transition-colors duration-200'
                >Create Vendor</button>
            </div>
        </form>

   </div>
   </>
  )
}

export default VendorCreationForm
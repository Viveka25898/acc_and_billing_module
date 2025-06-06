import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const VendorInvoiceUpload = () => {
    const availablePOs=[
                        "PO12345",
                        "PO67890",
                        "PO24680",
                        "PO11223",]
  const [invoiceData,setInvoiceData]=useState({
                                                invoiceNumber: "",
                                                invoiceDate: "",
                                                invoiceMonth: "",
                                                coveredPOs: [],
                                                remarks: "",
                                                invoiceFile: null,
                                            })

  const [errors,setErrors]=useState({})
  const [successMsg,setSuccessMsg]=useState("")
  const navigate=useNavigate()

  //Handle Change Function
  const handleChange=(e)=>{
    const {name,value,files}=e.target
    if(name==="invoiceFile"){
        setInvoiceData({...invoiceData,[name]:files[0]})      
  } else{
    setInvoiceData({...invoiceData,[name]:value})
  }
}

  //PO Selection Function
 const handlePOSelection = (po) => {
    setInvoiceData((prev) => {
      const isSelected = prev.coveredPOs.includes(po);
      return {
        ...prev,
        coveredPOs: isSelected
          ? prev.coveredPOs.filter((item) => item !== po)
          : [...prev.coveredPOs, po],
      };
    });
  };

//Errors - Validate Form
const validateForm=()=>{
    const errs=[]
    if(!invoiceData.invoiceNumber) errs.invoiceNumber="Invoice Number is required"
    if(!invoiceData.invoiceDate) errs.invoiceDate="Invoice Date is required"
    if(!invoiceData.invoiceMonth) errs.invoiceMonth="Invoice Month is required"
    if(invoiceData.coveredPOs.length===0) errs.coveredPOs="Select atleast one PO"
    if(!invoiceData.invoiceFile) errs.invoiceFile="Upload the Invoice File"
    setErrors(errs)
    return Object.keys(errs).length === 0;
}

//Handle Submit Function
const handleSubmit=(e)=>{
    e.preventDefault()
    if(!validateForm()) return;
    const storedInvoice=JSON.parse(localStorage.getItem("vendorInvoices")) || [];
    const newInvoice = {
        ...invoiceData,
        status:"Pending",
        id:Date.now()
    }

    localStorage.setItem("vendorInvoices",JSON.stringify([...storedInvoice,newInvoice]))
    setSuccessMsg("Invoice Upload Successfully and sent dor PH approval")
     setInvoiceData({
      invoiceNumber: "",
      invoiceDate: "",
      invoiceMonth: "",
      coveredPOs: [],
      remarks: "",
      invoiceFile: null,
    });
    setTimeout(()=>setSuccessMsg(""),4000)

}

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded shadow-md mt-6'>
        <div className='flex justify-end'>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow cursor-pointer 
         "
         onClick={()=>navigate("/dashboard/vendor/my-invoices")}
         >
            My Invoices
        </button>
        </div>
        <h2 className='text-2xl font-bold mb-6 text-green-700'>Upload Invoice</h2>
         {successMsg && <div className="mb-4 text-green-600 font-medium">{successMsg}</div>}
        <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
                <label className='block text-sm font-medium'>Invoice Number</label>
                <input 
                type="text"
                name='invoiceNumber'
                 value={invoiceData.invoiceNumber}
                 onChange={handleChange}
                className='w-full mt-1 border border-gray-300 rounded px-3 py-2'
                />
                {errors.invoiceNumber && <p className="text-red-500 text-sm">{errors.invoiceNumber}</p>}
            </div>

            <div>
                <label className='block text-sm font-medium'>Invoice Date</label>
                <input 
                type="date"
                name='invoiceDate'
                value={invoiceData.invoiceDate}
                 onChange={handleChange}
                className='w-full mt-1 border border-gray-300 rounded px-3 py-2'
                />
                {errors.invoiceDate && <p className="text-red-500 text-sm">{errors.invoiceDate}</p>}
            </div>

            <div>
                 <label className='block text-sm font-medium'>Invoice Month</label>
                <input 
                type="month"
                name='invoiceMonth'
                value={invoiceData.invoiceMonth}
                 onChange={handleChange}
                className='w-full mt-1 border border-gray-300 rounded px-3 py-2'
                />
                {errors.invoiceMonth && <p className="text-red-500 text-sm">{errors.invoiceMonth}</p>}
            </div>

            <div>
                <label className='block text-sm font-medium'>Covered POs</label>
                    <div className='grid grid-cols-2 gap-2'>
                    {
                        availablePOs.map((po)=>(
                            <label key={po} className='flex items-center space-x-2'>
                                <input 
                                type="checkbox"
                                checked={invoiceData.coveredPOs.includes(po) } 
                                onChange={()=>handlePOSelection(po)} 
                                
                                />
                                <span>{po}</span>

                            </label>

                        ))
                    }

                    </div>
                 {errors.coveredPOs && <p className="text-red-500 text-sm mt-1">{errors.coveredPOs}</p>}
                </div>

                <div>
                    <label className='block text-sm font-medium'>Upload Invoice File (PDF/Image)</label>
                    <input 
                    type="file"
                    name='invoiceFile'
                    accept='application/pdf,image/*'
                    onChange={handleChange}
                    className='w-full mt-1 border border-gray-300 rounded px-3 py-2 '
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Remarks (Optional)</label>
                    <textarea
                        name="remarks"
                        className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                        rows="3"
                        value={invoiceData.remarks}
                         onChange={handleChange}
                    />
                </div>

                <div className='pt-4'>
                    <button 
                    type='submit'
                    className='bg-green-600 hover:bg-green-700 w-full text-white px-6 py-2 rounded-shadow cursor-pointer transition'>
                        Submit Invoice
                    </button>
                </div>

        </form>

    </div>
  )
};

export default VendorInvoiceUpload
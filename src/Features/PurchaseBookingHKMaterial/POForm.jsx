/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'

const POForm = () => {
    const [po,setPo]=useState({
        buyerName:"",
        buyerAddress:"",
        vendorName:"",
        vendorAddress:"",
        poDate:"",
        deliveryDate:"",
        paymentTerms:"",
        freightCharges:0,
        otherCharges:0,
        items:[
            {
                description:"",
                quantity:1,
                rate:0,
                gst:0,
            },
        ],
        terms:""
    })
//     const location = useLocation();
// useEffect(() => {
//   if (location.state?.requestData) {
//     const data = location.state.requestData;
//     console.log(data);

//     setPo((prev) => ({
//       ...prev,
//       vendorName: data.vendorName || "", // Adjust field mappings
//       vendorAddress: data.vendorAddress || "",
//       items: data.items || prev.items,
//     }));
//   }
// }, [location.state]);
// console.log(po);

    //Item Change
    const handleItemChange=(index,field,value)=>{
        const updatedItems=[...po.items]
        updatedItems[index][field]=field==="quantity" || field==="rate" || field==="gst" ? Number(value) : value
        setPo({...po,items:updatedItems})

    }

//Add Item
const addItem=()=>{
    setPo({...po,items:[...po.items,{description:"",quantity:1,rate:0,gst:0}]})
}

//Remove Item
const removeItem=(index)=>{
    const updatedItems=po.items.filter((_,i)=>i!==index)
    setPo({...po,items:updatedItems})
}

const calculateSubTotal=()=>po.items.reduce((sum,item)=>sum + item.quantity*item.rate,0)
//GST
const calculateGst=()=>po.items.reduce((sum,item)=>sum + (item.quantity*item.rate*item.gst)/100,0)
//Grand Total
const calculateGrandTotal=()=> calculateSubTotal() + calculateGst() + Number(po.freightCharges) + Number(po.otherCharges)
    
//Handle Submit
const handleSubmit=(e)=>{
e.preventDefault();
localStorage.setItem("purchaseOrder",JSON.stringify(po))
toast.success("Purchase Order Placed Successfully !.",{
    position: "top-right",
    autoClose: 3000,
}
)
setPo({
    buyerName:"",
    buyerAddress:"",
    vendorName:"",
    vendorAddress:"",
    poDate:"",
    deliveryDate:"",
    paymentTerms:"",
    freightCharges:0,
    otherCharges:0,
    items:[
        {
            description:"",
            quantity:1,
            rate:0,
            gst:0,
        },
    ],
    terms:""
})
}
  return (
    <>
    <div className='max-w-6xl mx-auto p-4 bg-white shadow-md'>
        <h2 className='text-2xl font-bold mb-4 text-center text-green-600'>Purchase Order</h2>

        {/* ***************************FORM******************************* */}
        <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Buyer and Vendor Information  */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <label className='block font-semibold'> Buyer Name</label>
                    <input 
                    className='w-full border p-2 rounded'
                    value={po.buyerName}
                    onChange={(e)=>setPo({...po,buyerName:e.target.value})}
                    type="text" />
                </div>
                <div>
                    <label className='block font-semibold'> Vendor Name</label>
                    <input 
                    className='w-full border p-2 rounded'
                    value={po.vendorName} onChange={(e) => setPo({ ...po, vendorName: e.target.value })}
                    type="text" />
                </div>
                <div>
                    <label className='block font-semibold'> Buyer Address</label>
                    <textarea 
                    value={po.buyerAddress} onChange={(e) => setPo({ ...po, buyerAddress: e.target.value })}
                    className='w-full border p-2 rounded'
                    type="text" />
                </div>
                <div>
                    <label className='block font-semibold'> Vendor Address</label>
                    <textarea 
                    className='w-full border p-2 rounded'
                    value={po.vendorAddress} onChange={(e) => setPo({ ...po, vendorAddress: e.target.value })}
                    type="text" />
                </div>
            </div>

            {/* ***************PO Details********************* */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                    <label className='block font-semibold'>PO Date</label>
                    <input type="date"
                    value={po.poDate} onChange={(e) => setPo({ ...po, poDate: e.target.value })}
                    className='w-full border p-2 rounded'
                    />
                </div>
                <div>
                    <label className='block font-semibold'>Deliver Date</label>
                    <input type="date"
                    value={po.deliveryDate} onChange={(e) => setPo({ ...po, deliveryDate: e.target.value })}
                    className='w-full border p-2 rounded'
                    />
                </div>
                <div>
                    <label className='block font-semibold'>Payment Terms</label>
                    <input type="text"
                    value={po.paymentTerms} onChange={(e) => setPo({ ...po, paymentTerms: e.target.value })}
                    className='w-full border p-2 rounded'
                    />
                </div>
            </div>

            {/* *********************************Item Table************************** */}
            <div>
                <h3 className='text-lg font-bold mb-2'>Items</h3>
                <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm border'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className="border p-2">Description</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Rate</th>
                                <th className="border p-2">GST (%)</th>
                                <th className="border p-2">Total</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                po.items.map((item,index)=>(
                                    <tr key={index}>
                                        <td className='border p-2'>
                                            <input type="text" className='w-full' 
                                            value={item.description}
                                            onChange={(e)=>handleItemChange(index,"description", e.target.value)}
                                            />
                                        </td>
                                        <td className="border p-2">
                                        <input type="number" className="w-full" 
                                        value={item.quantity} 
                                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                                        </td>
                                        <td className="border p-2">
                                        <input type="number" className="w-full" 
                                        value={item.rate} 
                                        onChange={(e) => handleItemChange(index, "rate", e.target.value)} />
                                        </td>
                                        <td className="border p-2">
                                        <input type="number" className="w-full" 
                                        value={item.gst} 
                                        onChange={(e) => handleItemChange(index, "gst", e.target.value)} />
                                        </td>
                                        <td className='border p-2 text-right'>
                                        ₹{(item.quantity*item.rate*(1+item.gst/100)).toFixed(2)}
                                        </td>
                                        <td className='border p-2 text-center'> 
                                            <button type='button'
                                            onClick={()=>removeItem(index)}
                                            className='text-red-500'
                                            >X</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {/* Add item Button Div */}
                <button
                type='button'
                onClick={addItem}
                className='mt-2 px-2 py-1 bg-green-400 text-white rounded'
                >+ Add Item</button>
            </div>

            {/* Charges and Total  */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                <label className="block font-semibold">Freight Charges</label>
                <input type="number" className="w-full border p-2 rounded" value={po.freightCharges} onChange={(e) => setPo({ ...po, freightCharges: e.target.value })} />
                </div>
                <div>
                    <label className="block font-semibold">Other Charges</label>
                    <input type="number" className="w-full border p-2 rounded" value={po.otherCharges} onChange={(e) => setPo({ ...po, otherCharges: e.target.value })} />
                </div>
            </div>

             {/* Summary */}
                <div className="text-right space-y-1">
                <p>Subtotal: ₹{calculateSubTotal().toFixed(2)}</p>
                <p>GST Total: ₹{calculateGst().toFixed(2)}</p>
                <p className="font-bold">Grand Total: ₹{calculateGrandTotal().toFixed(2)}</p>
                </div>
                
                 {/* Terms & Conditions */}
                    <div>
                        <label className="block font-semibold">Terms & Conditions</label>
                        <textarea className="w-full border p-2 rounded" value={po.terms} onChange={(e) => setPo({ ...po, terms: e.target.value })} />
                    </div>

                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded text-lg">Submit Purchase Order</button>

            </form>

        </div>
    </>
  )
}

export default POForm
import React from 'react';
import orderSuccessAnimation from "../../assets/orderSuccess.json";
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';

export const OrderSuccessPage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/shop/account'); // This will navigate to the account page
      };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg text-center flex flex-col items-center gap-4">
        <div className="w-40 h-28">
          <Lottie animationData={orderSuccessAnimation} />
        </div>

        <div className="mt-4">
          {/* <h2 className="text-xl font-light">Hey </h2> */}
          <h1 className="text-2xl font-semibold mt-2">Your Order is Placed</h1>
          <p className="text-sm text-gray-500 mt-1">Thank you for shopping with us ❤️</p>
        </div>

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleNavigate} >
            Check order status in My Orders
          </button>
        
      </div>
    </div>
  )
}

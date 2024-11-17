import { addCartProduct } from '@/redux/Cartslice';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const getAllCartData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/user/getAll-cart-items`, {
        withCredentials: true,
      });
      console.log(response);

      const cartData = response.data
      dispatch(addCartProduct(cartData));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllCartData();
  }, []);

  return (
    <div className='px-4 sm:px-20 py-7'>
      <div>
        {/** left the cart items */}
        <div>
          
        </div>

        {/** right total price */}
        <div>

        </div>
      </div>
    </div>
  );
};

export default Cart;

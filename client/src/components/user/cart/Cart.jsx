import { addCartProduct } from "@/redux/Cartslice";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paperProductPriceCalculation, productPriceCalculation } from "@/components/features/Pricecalculation";
import Loading from "@/components/features/Loading";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser } = useSelector(state => state.user || {});
  const [totalProductPrice, setTotalProductPrice] = useState(0);

  const getAllCartData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/user/getAll-cart-items`,
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(addCartProduct(response.data));
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, type) => {
    const itemToUpdate = cartItems?.data.find((item) => item._id === id);

    if (!itemToUpdate) return;

    const newQuantity =
      type === "increment"
        ? itemToUpdate.pricing.copy + 1
        : itemToUpdate.pricing.copy - 1;

    if (newQuantity < 1 || newQuantity > 25) {
      toast.warning("Quantity must be between 1 and 25.");
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/user/update-cart-paperproduct/${id}`,
        { copy: newQuantity },
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedItems = cartItems?.data.map((item) =>
          item._id === id
            ? {
              ...item,
              pricing: {
                ...item.pricing,
                copy: newQuantity,
              },
            }
            : item
        );

        dispatch(
          addCartProduct({
            ...cartItems,
            data: updatedItems,
          })
        );

        // toast.success("Quantity updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update quantity:", error.message);
      toast.error("Unable to update quantity. Please try again.");
    }
  };

  const updateProductQuantity = async (id, type) => {
    const itemToUpdate = cartItems?.productCartData.find((item) => item._id === id);

    if (!itemToUpdate) return;

    const newQuantity =
      type === "increment"
        ? itemToUpdate.pricing.quantity + 1
        : itemToUpdate.pricing.quantity - 1;

    if (newQuantity < 1 || newQuantity > 200) {
      toast.warning("Quantity must be between 1 and 200.");
      return;
    }

    setTotalProductPrice(itemToUpdate.pricing.price * newQuantity);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/user/update-cart-product/${id}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedItems = cartItems?.productCartData.map((item) =>
          item._id === id
            ? {
              ...item,
              pricing: {
                ...item.pricing,
                quantity: newQuantity,
              },
            }
            : item
        );

        dispatch(
          addCartProduct({
            ...cartItems,
            productCartData: updatedItems,
          })
        );
      }
    } catch (error) {
      console.error("Failed to update quantity:", error.message);
      toast.error("Unable to update quantity. Please try again.");
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/user/delete-cart-paperproduct/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedItems = cartItems.data.filter((item) => item._id !== id);

        // Update local state immediately
        dispatch(
          addCartProduct({
            ...cartItems,
            data: updatedItems,
            totalItems: cartItems.totalItems - 1,
          })
        );
        toast.success("Item deleted successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item.");
      console.log(error.message);
    }
  };

  const deleteProductItem = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/user/delete-cart-product/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedItems = cartItems.productCartData.filter((item) => item._id !== id);

        // Update local state immediately
        dispatch(
          addCartProduct({
            ...cartItems,
            productCartData: updatedItems,
            totalItems: cartItems.totalItems - 1,
          })
        );
        toast.success("Item deleted successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item.");
      console.log(error.message);
    }
  }

  const calculateTotalProduct = () => {
    if (!cartItems?.productCartData || !Array.isArray(cartItems.productCartData)) return 0;

    return cartItems.productCartData.reduce((total, item) => {
      const productPrice = productPriceCalculation({
        price: item.pricing.price,
        quantity: item.pricing.quantity,
        backlogosize: item.pricing.backlogosize,
        fontlogosize: item.pricing.fontlogosize,
        printlocation: item.pricing.printlocation,
      });
      return total + productPrice;
    }, 0);
  };
  const calculateCartTotal = () => {
    if (!cartItems?.data || !Array.isArray(cartItems.data)) return 0;
    return cartItems.data.reduce((total, item) => {
      const priceDetails = paperProductPriceCalculation({
        copy: item.pricing.copy,
        pages: item.pricing.pages,
        printcolor: item.pricing.printcolor,
        papersize: item.pricing.papersize,
        papertype: item.pricing.papertype,
        printingside: item.pricing.printingside,
        price: item.pricing.price,
        binding: item.pricing.binding,
      });
      return total + priceDetails.totalPrice;
    }, 0);
  };

  useEffect(() => {
    getAllCartData();
  }, []);

  const totalPrice = useMemo(() => calculateCartTotal(), [cartItems]) + useMemo(() => calculateTotalProduct(), [cartItems]);

  

  if (loading) return <Loading />;

  if (!currentUser || cartItems?.totalItems === 0)
    return (
      <div className="flex flex-col items-center py-20 w-full min-h-screen bg-slate-50 gap-5">
        <h2 className="text-center text-4xl font-bold">Your Cart is empty!</h2>
        <p className="text-center text-lg">
          Looks like you haven't added anything yet. <br /> Start browsing our
          products and add your favorites to your cart.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-[#533d64] hover:bg-[#7c519b]"
        >
          Continue Shopping
        </Button>
      </div>
    );

  return (
    <div className="px-4 sm:px-20 py-7">
      <h2 className="text-3xl text-slate-600 font-bold pb-4">Shopping Cart</h2>
      <div className="flex lg:flex-row flex-col gap-10">
        <div className="flex flex-col w-full gap-4 flex-1">
          {cartItems?.data?.map((item) => {
            const priceDetails = paperProductPriceCalculation({
              copy: item.pricing.copy,
              pages: item.pricing.pages,
              printcolor: item.pricing.printcolor,
              papersize: item.pricing.papersize,
              papertype: item.pricing.papertype,
              printingside: item.pricing.printingside,
              price: item.pricing.price,
              binding: item.pricing.binding,
            });

            return (
              <div
                className="flex gap-2 border p-2 md:px-4 rounded-md shadow-sm"
                key={item._id}
              >
                <div className="flex justify-between w-full items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.details.productname}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {item.pricing.papertype}.{item.pricing.orientation}.
                      {item.pricing.papersize}.{item.pricing.printingside}.
                      {item.pricing.printcolor}
                    </p>
                    <h2 className="text-lg font-semibold text-slate-500">
                      {item.pricing.binding}
                    </h2>
                    <p>Rate: Rs {item.pricing.price || 0}/page</p>
                    <p>Pages: {item.pricing.pages || 0}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex gap-2 border rounded items-center">
                        <button
                          className="py-1 px-2 hover:bg-slate-50"
                          onClick={() => updateQuantity(item._id, "decrement")}
                        >
                          <p className="font-bold text-xl">-</p>
                        </button>
                        <p className="py-1 px-2">{item.pricing.copy}</p>
                        <button
                          className="py-1 px-2 hover:bg-slate-50"
                          onClick={() => updateQuantity(item._id, "increment")}
                        >
                          <p className="font-bold text-xl">+</p>
                        </button>
                      </div>
                      <MdDelete
                        size={26}
                        className="text-red-600 cursor-pointer"
                        onClick={() => deleteItem(item._id)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <h3>
                      Rs.{" "}
                      <span className="text-xl font-semibold">
                        {priceDetails.totalPrice}
                      </span>
                    </h3>
                    <p>
                      Binding:{" "}
                      <span className="text-lg font-semibold">
                        Rs {priceDetails.bindingCost}
                      </span>
                    </p>
                    <p>
                      Sold by:{" "}
                      <span className="text-lg font-semibold text-slate-600">
                        Mero Sathi
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {
            cartItems?.productCartData?.map(item => (
              <div
                className="flex gap-2 border p-2 md:px-4 rounded-md shadow-sm items-center justify-between w-full"
                key={item._id}
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.details.name}</h3>
                  <p className="text-xs text-slate-600">
                    {item.details.color}.{item.pricing.backlogosize}.
                    {item.pricing.fontlogosize}.{item.pricing.printlocation}.
                    {item.details.size}
                  </p>
                  <p>Rate: Rs {item.pricing.price || 0}/item</p>
                  <p>Quantity: {item.pricing.quantity || 0}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex gap-2 border rounded items-center">
                      <button
                        className="py-1 px-2 hover:bg-slate-50"
                        onClick={() => updateProductQuantity(item._id, "decrement")}
                      >
                        <p className="font-bold text-xl">-</p>
                      </button>
                      <p className="py-1 px-2">{item.pricing.quantity || 0}</p>
                      <button
                        className="py-1 px-2 hover:bg-slate-50"
                        onClick={() => updateProductQuantity(item._id, "increment")}
                      >
                        <p className="font-bold text-xl">+</p>
                      </button>
                    </div>
                    <MdDelete
                      size={26}
                      className="text-red-600 cursor-pointer"
                      onClick={() => deleteProductItem(item._id)}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end items-end">
                  <h3>
                    Rs.{" "}
                    <span className="text-xl font-semibold">
                      {item.pricing.price * item.pricing.quantity}
                    </span>
                  </h3>
                  <p>
                    Shipping:{" "}
                    <span className="text-lg font-semibold">Rs 0</span>
                  </p>
                  <p>
                    Sold by:{" "}
                    <span className="text-lg font-semibold text-slate-600">
                      Mero Sathi
                    </span>
                  </p>
                </div>
              </div>
            ))
          }

        </div>
        <div className="flex gap-3 border p-2 md:px-4 rounded-md shadow-sm flex-col flex-1 max-h-[200px] w-full">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-slate-600">Print Cost</h2>
            <p className="text-2xl font-semibold ">Rs. {totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-slate-600">
              Shipping Charge
            </h2>
            <p className="text-2xl font-semibold ">Rs. 0</p>
          </div>
          <hr />
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold text-slate-600">Sub total</h2>
            <p className="text-2xl font-semibold ">Rs. {totalPrice}</p>
          </div>
          <Button className="bg-[#533d64] hover:bg-[#7c519b]">
            Proceed to Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

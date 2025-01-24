import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Store } from 'lucide-react';

const Checkout = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [orderDetails, setOrderDetails] = useState({
    subtotal: 31.0,
    discount: 0.0,
    shipping: 0.0,
    serviceCharge: 0.0,
    tax: 0.0,
  });

  const applyDiscount = () => {
    if (discountCode === 'KESHAV20') {
      setOrderDetails((prev) => ({
        ...prev,
        discount: 5.0, // Example discount value
      }));
      setDiscountMessage('Discount applied successfully!');
    } else {
      setDiscountMessage('Invalid discount code!');
    }
  };

  const proceedToPayment = () => {
    setIsLoading(true);
    // Simulate payment process
    setTimeout(() => {
      setIsLoading(false);
      alert('Proceeding to payment...');
    }, 2000);
  };

  const orderTotal =
    orderDetails.subtotal +
    orderDetails.shipping +
    orderDetails.serviceCharge +
    orderDetails.tax -
    orderDetails.discount;

  return (
    <div className="min-h-screen mx-4 sm:mx-20 py-5 flex flex-col">
      <h2 className="my-6 font-bold text-3xl text-slate-600">Checkout</h2>
      <div className="flex gap-2 flex-col lg:flex-row">
        {/* Delivery Options Section */}
        <div className="flex-1 border rounded-sm p-3 gap-2 flex flex-col">
          <p className="text-xl font-bold text-slate-600">How would you like to receive your order?</p>
          <div className="flex gap-4 py-2 flex-col sm:flex-row">
            <Button className="flex-1 bg-[#533d64] hover:bg-[#7c519b]" aria-label="Pick up order in-store">
              In Store From Store
            </Button>
            <Button
              className="flex-1 bg-gray-300"
              disabled
              aria-label="Home delivery option disabled"
            >
              Home Delivery
              <span className="ml-1 text-xs text-slate-500">(Coming Soon)</span>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Free pick-up from store</p>
            <div className="py-2 flex gap-2 font-semibold">
              <Store className="text-[#533d64]" />
              <p>Print store - Abc store near college</p>
            </div>
            <p className="text-sm text-slate-600 p-1 bg-slate-50 font-serif hover:bg-slate-100">
              Shop No 234, Biratnagar Nepal Lorem, ipsum.
            </p>
            <div className="py-2 flex gap-2">
              <Phone className="text-[#533d64]" />
              <p>9841234567</p>
            </div>
            <p className="bg-slate-50 p-2 rounded-sm">
              Your order will be ready for pickup within the next 2 hours. Please feel free to collect it anytime during
              store hours. For real-time updates, check your email or the "My Orders" section for notifications on early
              completion or potential delays.
            </p>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="flex-1 flex flex-col gap-2 rounded-md border p-4">
          <p className="text-xl font-bold text-slate-600">Order Summary</p>
          <div className="flex justify-between items-center">
            <p className="text-sm sm:text-md">Discount Code</p>
            <div className="flex">
              <input
                type="text"
                className="outline-none border p-1"
                placeholder="KESHAV20"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <Button
                className="bg-[#533d64] px-1 sm:px-3"
                onClick={applyDiscount}
                aria-label="Apply discount code"
              >
                Apply
              </Button>
            </div>
          </div>
          {discountMessage && <p className="text-sm text-red-500 mt-2">{discountMessage}</p>}
          <hr />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p className="font-semibold">Rs. {orderDetails.subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-[#533d64]">
              <p>Discount</p>
              <p className="font-semibold">Rs. -{orderDetails.discount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping Charge</p>
              <p className="font-semibold">Rs. {orderDetails.shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Service Charge</p>
              <p className="font-semibold">Rs. {orderDetails.serviceCharge.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax</p>
              <p className="font-semibold">Rs. {orderDetails.tax.toFixed(2)}</p>
            </div>
          </div>
          <hr />
          <div className="flex justify-between font-bold">
            <p>Order Total :</p>
            <p>Rs. {orderTotal.toFixed(2)}</p>
          </div>
          <Button
            className={`bg-[#533d64] hover:bg-[#7c519b] ${isLoading ? 'opacity-50' : ''}`}
            onClick={proceedToPayment}
            disabled={isLoading}
            aria-label="Proceed to payment"
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

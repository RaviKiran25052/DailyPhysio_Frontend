import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { RiCheckLine } from 'react-icons/ri';

const API_URL = process.env.REACT_APP_API_URL;

const MembershipUpdateModal = ({ isOpen, onClose, currentPlan, onUpdate }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const plans = [
    {
      type: 'free',
      name: 'Free',
      price: '$0',
      description: 'Basic features for therapists just starting out'
    },
    {
      type: 'monthly',
      name: 'Monthly',
      price: '$19.99',
      period: 'per month',
      description: 'Everything you need for a growing practice'
    },
    {
      type: 'yearly',
      name: 'Yearly',
      price: '$199.99',
      period: 'per year',
      description: 'Best value for established practices',
      popular: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value
    });
  };

  const validateForm = () => {
    // Skip validation for free plan
    if (selectedPlan === 'free') return true;
    
    // Simple validation for paid plans
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!cardDetails.cardName) {
        toast.error('Please enter the name on card');
        return false;
      }
      if (!cardDetails.expiryDate || !cardDetails.expiryDate.includes('/')) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      
      // For demo purposes, we're not sending actual card details to the backend
      // In a real app, you would use a payment processor like Stripe
      const response = await axios.put(
        `${API_URL}/therapist/membership`,
        { 
          type: selectedPlan,
          paymentMethod
        },
        {
          headers: { Authorization: `Bearer ${therapistInfo.token}` }
        }
      );
      
      onUpdate(response.data);
      toast.success(`Successfully updated to ${selectedPlan} plan`);
      onClose();
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Update failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto py-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-white">
            Update Membership Plan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Selection */}
            <div>
              <label className="block text-base font-medium text-white mb-2">
                Select Plan
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans.map((plan) => (
                  <div
                    key={plan.type}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedPlan === plan.type
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedPlan(plan.type)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm">{plan.name}</h4>
                      {selectedPlan === plan.type && (
                        <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <RiCheckLine className="text-white" size={12} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-baseline mb-1">
                      <span className="text-lg font-bold">{plan.price}</span>
                      {plan.period && <span className="text-gray-400 ml-1 text-xs">{plan.period}</span>}
                    </div>
                    <p className="text-gray-400 text-xs">{plan.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            {selectedPlan !== 'free' && (
              <>
                <div>
                  <label className="block text-base font-medium text-white mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Credit/Debit Card</h4>
                        {paymentMethod === 'card' && (
                          <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <RiCheckLine className="text-white" size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">PayPal</h4>
                        {paymentMethod === 'paypal' && (
                          <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <RiCheckLine className="text-white" size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardDetails.cardName}
                        onChange={handleInputChange}
                        placeholder="John Smith"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <div className="bg-gray-700 p-3 rounded-lg text-center">
                    <p className="text-gray-300 text-sm mb-3">
                      You will be redirected to PayPal to complete your payment after confirming.
                    </p>
                    <div className="flex justify-center">
                      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="h-8" />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Summary */}
            <div className="bg-gray-700 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">Order Summary</h4>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-300">Plan:</span>
                <span className="font-medium capitalize">{selectedPlan} Plan</span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-300">Price:</span>
                <span className="font-medium">
                  {selectedPlan === 'free' ? 'Free' : 
                   selectedPlan === 'monthly' ? '$19.99/month' : '$199.99/year'}
                </span>
              </div>
              {selectedPlan !== 'free' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Payment Method:</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              >
                {loading ? 'Processing...' : 'Confirm Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipUpdateModal; 
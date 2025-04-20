import React from 'react';

const MembershipPlans = () => {

  return (
    <div className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Membership Plans</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plans are per person. Discounts are applied to multiple member upgrades.
          </p>
          <p className="text-xl text-gray-300 mt-2">
            See <span className="font-semibold">Group Plans</span> at bottom of the page for multiple member sign up and group rates.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300 mb-12 rounded-full"></div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 flex flex-col">
              <h3 className="text-3xl font-bold mb-6">Free</h3>

              <div className="mb-8">
                <div className="text-4xl font-bold">$0.00</div>
                <div className="text-gray-400 mt-1">Single member</div>
              </div>

              <div className="flex-grow"></div>

              <button
                // onClick={handleFreePlanClick}
                className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-500 rounded-xl text-white text-lg font-medium transition duration-300"
              >
                Free Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-purple-900 flex flex-col relative overflow-hidden">
              {/* PRO Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold py-1 px-3 rounded-md transform rotate-0 uppercase text-sm">
                PRO
              </div>

              <h3 className="text-3xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-300">
                  Pro
                </span>
              </h3>

              <div className="mb-8">
                <div className="flex items-baseline">
                  <div className="text-4xl font-bold">$7</div>
                  <div className="text-gray-400 ml-2">per month</div>
                </div>
                <div className="text-gray-400 mt-1">
                  Single member Pro subscription
                </div>
                <div className="text-gray-300 mt-1">
                  $7/month or $70/year
                </div>
              </div>

              <div className="flex-grow"></div>

              <button
                // onClick={handleProPlanClick}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded-xl text-white text-lg font-medium transition duration-300"
              >
                Upgrade to Pro
              </button>

              <div className="mt-4 text-center text-sm text-gray-400">
                Want to Upgrade an existing account or upgrade Other Members? Please{' '}
                <a href="/" className="text-blue-400 hover:underline cursor-pointer">
                  Log in
                </a>{' '}
                First
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-gray-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 text-purple-400">Free Features</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Access to basic exercises</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Limited exercise history</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Standard support</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4 text-purple-400">Pro Features</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Access to all premium exercises</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited exercise history</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Custom exercise creation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaClipboardList,
  FaDumbbell,
  FaUserMd,
  FaUsers,
  FaChartLine,
  FaCalendarAlt
} from 'react-icons/fa';
import TherapistHeader from '../components/TherapistHeader';
import TherapistLogin from '../components/TherapistLogin';
import TherapistRegister from '../components/TherapistRegister';
import AccountNotActivatedModal from '../components/Modals/AccountNotActivatedModal';
import RegistrationSuccessModal from '../components/Modals/RegistrationSuccessModal';
import AccountRejectedModal from '../components/Modals/AccountRejectedModal';

const TherapistDashboard = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [showNotActivatedModal, setShowNotActivatedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activePlan, setActivePlan] = useState(1); // Default to Pro Monthly (index 1)

  useEffect(() => {
    if (localStorage.getItem('therapistInfo')) {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      if (therapistInfo.status === 'active') {
        navigate('/home');
      }
    }
  }, [navigate]);

  const toggleAuthModals = () => {
    setShowLoginModal(!showLoginModal);
    setShowRegisterModal(!showRegisterModal);
  }

  const handleLoginClose = (status = 'inactive', isSubmitted) => {
    setShowLoginModal(false);

    if (status === 'active') {
      navigate('/therapist/home');
    } else if (status === 'rejected' && isSubmitted) {
      setShowRejectedModal(true);
    } else if (status === 'inactive' && isSubmitted) {
      setShowNotActivatedModal(true);
    }
  }

  const handleRegisterClose = (isSuccess) => {
    setShowRegisterModal(false);
    if (isSuccess) {
      setShowSuccessModal(true);
    }
  }

  const handleNotActivatedClose = () => {
    setShowNotActivatedModal(false);
    setShowLoginModal(true);
  }

  const handleRejectedClose = () => {
    setShowRejectedModal(false);
    setShowLoginModal(true);
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  }

  const handlePlanSelect = (planIndex) => {
    setActivePlan(planIndex);
    // Here you could also implement additional logic like:
    // - Open registration with pre-selected plan
    // - Track user selection in analytics
    // - Show additional details about the selected plan
  }

  // Membership plan data
  const membershipPlans = [
    {
      name: "Free",
      price: "$0",
      period: "",
      features: [
        "Basic exercise library",
        "Up to 10 patients",
        "Standard consultation tools",
        "Email support"
      ],
      featured: false,
      buttonText: "Start Free"
    },
    {
      name: "Pro Monthly",
      price: "$39",
      period: "/month",
      features: [
        "Full exercise library",
        "Unlimited patients",
        "Advanced analytics",
        "Priority support",
        "Custom exercise creation"
      ],
      featured: true,
      buttonText: "Try Pro Monthly"
    },
    {
      name: "Pro Yearly",
      price: "$349",
      period: "/year",
      features: [
        "Everything in Pro Monthly",
        "Save $119 annually",
        "Bulk patient import",
        "White-labeled patient portal",
        "API access"
      ],
      featured: false,
      buttonText: "Best Value"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <TherapistHeader
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
      />

      {/* Hero Section - Updated with darker heading color */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-500">
                <span className="text-white">DailyPhysio</span> for Therapists
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your all-in-one platform for managing patient exercises, consultations, and tracking rehabilitation progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-primary-800 to-primary-500 rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-8 py-3 bg-gray-700 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative overflow-hidden">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-8 right-0 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="relative">
                  <img
                    src="/assets/start your healing.jpg"
                    alt="Therapist Dashboard Preview"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary-500">Powerful Tools for Rehabilitation Professionals</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-primary-500 mb-4">
                <FaUsers size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Patient Management</h3>
              <p className="text-gray-400">Easily add, organize, and manage your patient database with detailed profiles and treatment history.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-primary-500 mb-4">
                <FaDumbbell size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exercise Library</h3>
              <p className="text-gray-400">Access a comprehensive library of exercises with detailed instructions, videos, and customization options.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-primary-500 mb-4">
                <FaClipboardList size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Routines</h3>
              <p className="text-gray-400">Create personalized exercise routines tailored to each patient's specific rehabilitation needs.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-primary-500 mb-4">
                <FaCalendarAlt size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Consultation Tools</h3>
              <p className="text-gray-400">Schedule and manage consultations, with integrated notes and exercise assignment capabilities.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-primary-500 mb-4">
                <FaChartLine size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-400">Monitor patient progress with detailed analytics, adherence metrics, and outcome measurements.</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/20">
              <div className="text-primary-500 mb-4">
                <FaUserMd size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Patient Portal</h3>
              <p className="text-gray-400">Patients access their assigned exercises through a dedicated portal, improving engagement and adherence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary-500">How DailyPhysio Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Patient Profiles</h3>
              <p className="text-gray-400">Add your patients to the system with detailed medical histories and rehabilitation needs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Assign Custom Exercises</h3>
              <p className="text-gray-400">Design personalized exercise programs from our extensive library or create your own.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Monitor Progress</h3>
              <p className="text-gray-400">Track patient adherence, progress, and outcomes with comprehensive analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Updated with selectable plans */}
      <section className="py-16 px-4 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary-500">Membership Plans</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your practice needs. Upgrade or downgrade anytime.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8">
            {membershipPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-xl overflow-hidden flex-1 max-w-md cursor-pointer transition-all duration-300 ${activePlan === index
                    ? 'border-2 border-primary-500 transform md:scale-105 shadow-xl shadow-primary-500/20'
                    : 'border border-gray-700 hover:border-primary-400'
                  }`}
                onClick={() => handlePlanSelect(index)}
              >
                {plan.featured && activePlan !== index && (
                  <div className="bg-primary-500 py-1 text-center">
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                )}
                {activePlan === index && (
                  <div className="bg-primary-600 py-1 text-center">
                    <span className="text-sm font-medium">Selected Plan</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${activePlan === index
                        ? 'bg-gradient-to-r from-primary-600 to-primary-800 hover:opacity-90'
                        : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent onClick
                      handlePlanSelect(index);
                      setShowRegisterModal(true);
                    }}
                  >
                    {activePlan === index ? "Select " + plan.name : plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-primary-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 2L12 7L7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 7V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white font-bold text-xl">DailyPhysio</span>
              </div>
              <p className="text-gray-400 mb-4">The complete platform for therapy and rehabilitation professionals.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Exercise Library</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 DailyPhysio. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && <TherapistLogin onClose={handleLoginClose} onRegister={toggleAuthModals} />}
      {showRegisterModal && <TherapistRegister onClose={handleRegisterClose} onLogin={toggleAuthModals} selectedPlan={activePlan} />}
      {showNotActivatedModal && <AccountNotActivatedModal onLgin={handleNotActivatedClose} onClose={() => setShowNotActivatedModal(false)} />}
      {showRejectedModal && <AccountRejectedModal onLgin={handleRejectedClose} onClose={() => setShowRejectedModal(false)} />}
      {showSuccessModal && <RegistrationSuccessModal onClose={handleSuccessModalClose} />}
    </div>
  );
};

export default TherapistDashboard;
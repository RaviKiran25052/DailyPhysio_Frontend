import React, { useRef } from 'react';
import Hero from '../Components/Home/Hero';
import TrustedBy from '../Components/Home/TrustedBy';
import PopularClasses from '../Components/Home/PopularClasses';
import FeaturedCourses from '../Components/Home/FeaturedCourses';
import MembershipPlans from '../Components/Home/MembershipPlans';
import CallToAction from '../Components/Home/CallToAction';
import Footer from '../Components/Footer';
const HomePage = () => {

	const aboutRef = useRef(null);
	const programsRef = useRef(null);
	const exercisesRef = useRef(null);
	const plansRef = useRef(null);

	return (
		<div className="bg-gray-900 min-h-screen">
			<div ref={aboutRef} id="about">
				<Hero/>

			</div>
			<TrustedBy />

			<div ref={programsRef} id="programs">
				<PopularClasses />
			</div>

			<div ref={exercisesRef} id="exercises">
				<FeaturedCourses />
			</div>

			<div ref={plansRef} id="plans">
				<MembershipPlans />
			</div>

			<CallToAction />
			<Footer />
		</div>
		
	);
};

export default HomePage; 
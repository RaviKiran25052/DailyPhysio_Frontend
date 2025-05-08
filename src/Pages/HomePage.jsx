import React, { useEffect, useRef, useState } from 'react';
import Hero from '../Components/Home/Hero';
import TrustedBy from '../Components/Home/TrustedBy';
import PopularClasses from '../Components/Home/PopularClasses';
import FeaturedCourses from '../Components/Home/FeaturedCourses';
import MembershipPlans from '../Components/Home/MembershipPlans';
import CallToAction from '../Components/Home/CallToAction';
import Footer from '../Components/Footer';
import ExerciseCarousel from '../Components/Home/ExerciseCarousel';
import TherapistCarousel from '../Components/Home/TherapistCarousel';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const HomePage = () => {
	const aboutRef = useRef(null);
	const programsRef = useRef(null);
	const exercisesRef = useRef(null);
	const plansRef = useRef(null);
	const [trendingTherapists, setTrendingTherapists] = useState([]);
	const [trendingExercises, setTrendingExercises] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTrendingData = async () => {
			setLoading(true);

			try {
				const response = await fetch(`${API_URL}/public/trending`);

				if (!response.ok) {
					throw new Error(`API error: ${response.status}`);
				}

				const responseData = await response.json();
				const data = responseData.data;

				if (data?.trendingExercises?.length) {
					setTrendingExercises(data.trendingExercises);
				}

				if (data?.trendingTherapists?.length) {
					setTrendingTherapists(data.trendingTherapists);
				}
			} catch (error) {
				console.error('Error fetching trending data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTrendingData();
	}, []);

	return (
		<div className="bg-gray-900 min-h-screen">
			<div ref={aboutRef} id="about">
				<Hero />
			</div>
			<TrustedBy />

			<div ref={programsRef} id="programs">
				<PopularClasses />
			</div>

			<TherapistCarousel therapists={trendingTherapists} loading={loading} />
			<ExerciseCarousel exercises={trendingExercises} loading={loading} />

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
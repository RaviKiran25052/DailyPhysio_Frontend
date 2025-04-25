import React from 'react';
import ConsultationCard from './ConsultationCard';

const ConsultationList = ({ consultations }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{consultations.map(consultation => (
				<ConsultationCard key={consultation._id} consultation={consultation} />
			))}
		</div>
	);
};

export default ConsultationList;
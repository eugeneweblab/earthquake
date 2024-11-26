'use client';

import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import AddButton from '@/components/AddButton';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import { EARTHQUAKE_QUERY } from '@/graphql/earthquakeQueries';
import type { IEarthquakes } from '@/types/global.types';

const HomeComponent = () => {
	const [earthquakes, setEarthquakes] = useState<IEarthquakes[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const { loading, data: queryData } = useQuery(EARTHQUAKE_QUERY, {
		variables: { limit: 5, skip: Math.max((currentPage - 1) * 5, 0) },
	});

	useEffect(() => {
		if (queryData?.earthquakes) {
			setEarthquakes(queryData.earthquakes?.earthquakes);
			setTotalCount(queryData.earthquakes?.totalCount);
		}
	}, [queryData]);

	useEffect(() => {
		if (totalCount !== 0 && Math.ceil(totalCount / 5) < currentPage) {
			setCurrentPage((prevState) => prevState - 1);
		}
	}, [totalCount]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (loading) {
		return <div>Loading...</div>;
	}
	return (
		<div className="container mt-5">
			<h2 className="text-center mb-4">Earthquake List</h2>
			<AddButton />
			<Table
				earthquakes={earthquakes}
				setEarthquakes={setEarthquakes}
				setTotalCount={setTotalCount}
			/>
			<Pagination
				currentPage={currentPage}
				totalPages={Math.ceil(totalCount / 5)}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default HomeComponent;

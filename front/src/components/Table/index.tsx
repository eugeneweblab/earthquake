'use client';

import { useMutation } from '@apollo/client';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import EditButton from '@/components/EditButton';
import {
	DELETE_EARTHQUAKE_MUTATION,
	UPDATE_EARTHQUAKE_MUTATION,
} from '@/graphql/earthquakeQueries';
import type { IEarthquakes } from '@/types/global.types';

interface TableProps {
	earthquakes: IEarthquakes[];
	setEarthquakes: Dispatch<SetStateAction<IEarthquakes[]>>;
	setTotalCount: Dispatch<SetStateAction<number>>;
}

const Table: React.FC<TableProps> = ({ earthquakes, setEarthquakes, setTotalCount }) => {
	const [deleteEarthquake] = useMutation(DELETE_EARTHQUAKE_MUTATION, {
		onError: (error) => {
			alert('Error deleting earthquake');
			console.error(error);
		},
	});
	const [updateEarthquake] = useMutation(UPDATE_EARTHQUAKE_MUTATION);

	const handleDeleteClick = async (id: string) => {
		if (window.confirm('Are you sure you want to delete this earthquake?')) {
			const res = await deleteEarthquake({ variables: { id } });

			if (res.data?.deleteEarthquake) {
				setEarthquakes((prevEarthquakes) =>
					prevEarthquakes.filter((earthquake) => earthquake.id !== id),
				);
				setTotalCount((prevState) => prevState - 1);
				alert('Earthquake deleted successfully');
			} else {
				alert('Failed to delete earthquake');
			}
		}
	};

	const handleOnUserUpdate = async (
		id: string,
		formData: { magnitude: string; location: string; date: Date | null },
	) => {
		if (!id || !formData) return false;
		try {
			const res = await updateEarthquake({
				variables: {
					id,
					updateEarthquakeInput: {
						magnitude: parseFloat(formData.magnitude),
						location: formData.location,
						date: formData.date ? formData.date.toISOString() : null,
					},
				},
			});

			if (res.data?.updateEarthquake) {
				const updatedEarthquake = res.data.updateEarthquake;

				setEarthquakes((prevEarthquakes) =>
					prevEarthquakes.map((earthquake) =>
						earthquake.id === updatedEarthquake.id ? updatedEarthquake : earthquake,
					),
				);

				alert('Earthquake updated successfully');
			} else {
				alert('Failed to update earthquake');
			}
		} catch (error) {
			console.error('Error updating earthquake:', error);
			alert('Error updating earthquake');
		}
	};

	return (
		<div className="table-responsive">
			<table className="table table-bordered">
				<thead>
					<tr>
						<th>Location</th>
						<th>Magnitude</th>
						<th>Date</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody>
					{earthquakes?.map((item, idx) => (
						<tr key={`${item.id}-${idx}`}>
							<td>{item.location}</td>
							<td>{item.magnitude}</td>
							<td>{item.date}</td>
							<td>
								<div className="d-flex gap-1 align-items-center">
									<EditButton
										earthquakes={item}
										onUpdate={(formData) => handleOnUserUpdate(item.id, formData)}
									/>
									<button className="btn btn-danger" onClick={() => handleDeleteClick(item.id)}>
										Delete
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;

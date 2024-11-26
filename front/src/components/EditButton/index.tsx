import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import type { IEarthquakes } from '@/types/global.types';

interface EditButtonProps {
	earthquakes: IEarthquakes;
	onUpdate: (userData: { magnitude: string; location: string; date: Date | null }) => void;
}

const EditButton: React.FC<EditButtonProps> = ({ earthquakes, onUpdate }) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [formData, setFormData] = useState<{
		magnitude: string;
		location: string;
		date: Date | null;
	}>({
		location: earthquakes?.location || '',
		magnitude: String(earthquakes?.magnitude) || '',
		date: earthquakes?.date ? new Date(earthquakes?.date) : null,
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleDateChange = (date: Date | null) => {
		setFormData((prevState) => ({
			...prevState,
			date,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onUpdate(formData); // Call the onUpdate callback with the updated user data
		setShowModal(false);
	};

	return (
		<>
			<Button
				variant="warning"
				onClick={(e) => {
					e.preventDefault();
					setShowModal(true);
				}}
			>
				Edit
			</Button>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Earthquakes</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="formLocation">
							<Form.Label column={true}>Location</Form.Label>
							<Form.Control
								type="text"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="Location"
								required
							/>
						</Form.Group>

						<Form.Group className="mt-3" controlId="formMagnitude">
							<Form.Label column={true}>Magnitude</Form.Label>
							<Form.Control
								type="text"
								name="magnitude"
								value={formData.magnitude}
								onChange={handleChange}
								placeholder="Magnitude"
								required
							/>
						</Form.Group>

						<Form.Group className="mt-3" controlId="formDate">
							<Form.Label column={true}>Date</Form.Label>
							{/* @ts-ignore */}
							<DatePicker
								selected={formData.date}
								onChange={handleDateChange}
								className="form-control"
								placeholderText="Select date"
								dateFormat="yyyy-MM-dd"
								scrollableMonthYearDropdown
								showMonthYearDropdown
							/>
						</Form.Group>

						<div className="mt-3 d-flex gap-1">
							<Button
								variant="secondary"
								onClick={(e) => {
									e.preventDefault();
									setShowModal(false);
								}}
							>
								Close modal
							</Button>
							<Button variant="success" type="submit">
								Save Changes
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default EditButton;

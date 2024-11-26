import 'react-datepicker/dist/react-datepicker.css';

import { useMutation } from '@apollo/client';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { CREATE_EARTHQUAKE_MUTATION } from '@/graphql/earthquakeQueries';

const AddButton = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [formData, setFormData] = useState<{
		magnitude: string;
		location: string;
		date: Date | null;
	}>({
		location: '',
		magnitude: '',
		date: null,
	});
	const [statusMess, setStatusMess] = useState<string>('');

	const [createEarthquake] = useMutation(CREATE_EARTHQUAKE_MUTATION);

	const handleShow = () => setShowModal(true);

	const handleClose = () => {
		setShowModal(false);
		setStatusMess('');
	};

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!formData.magnitude || !formData.location || !formData.date) {
			setStatusMess('All fields are required.');
			return;
		}

		const { data } = await createEarthquake({
			variables: {
				createEarthquakeInput: {
					magnitude: parseFloat(formData.magnitude),
					location: formData.location,
					date: formData.date.toISOString(), // Преобразуем дату в ISO формат
				},
			},
		});

		if (data?.createEarthquake) {
			setStatusMess('');
			setFormData({ magnitude: '', location: '', date: null });
			handleClose();
		}
	};

	return (
		<>
			<Button variant="success" onClick={handleShow} className="mb-4">
				Add new
			</Button>

			<Modal show={showModal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>New Earthquake</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{statusMess && <div className="alert alert-danger">{statusMess}</div>}
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
							<Form.Label column={true} className={'w-100'}>
								Date
							</Form.Label>
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
							<Button variant="secondary" onClick={handleClose}>
								Close modal
							</Button>
							<Button variant="success" type="submit">
								Add
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default AddButton;

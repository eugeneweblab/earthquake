'use client';

import { useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';

import { LOGIN_MUTATION } from '@/graphql/loginQueries';
import { encryptData } from '@/helpers';
import { useStore } from '@/state/rootProvider';

const Box = styled.div`
	min-height: 70vh;
	display: flex;
	justify-content: center;
	align-items: center;

	.login-card {
		max-width: 400px;
		width: 100%;
		padding: 1.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		background: #fff;
	}

	.login-title {
		text-align: center;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.btn-login {
		width: 100%;
		margin-top: 1rem;
	}

	.status-message {
		margin-top: 1rem;
		text-align: center;
		color: red;
		font-size: 0.9rem;
	}
`;

const LoginPage = () => {
	const { userDispatch } = useStore();

	const [login, { loading }] = useMutation(LOGIN_MUTATION);
	const router = useRouter();

	const [formValues, setFormValues] = useState({
		email: '',
		password: '',
	});
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const {
				data: { login: loginData },
			} = await login({
				variables: { email: formValues.email, password: formValues.password },
			});

			if (loginData && process.env.NEXT_PUBLIC_ENCRYPTED_KEY) {
				const key = Buffer.from(process.env.NEXT_PUBLIC_ENCRYPTED_KEY, 'base64');

				const { data: userData } = loginData;

				const encryptedUserData = encryptData(userData, key);

				userDispatch({
					type: 'ADD_USER',
					payload: userData,
				});

				Cookies.set('earthquakeToken', loginData.token, {
					expires: 1,
					secure: true,
				});

				Cookies.set('earthquakeUserData', encryptedUserData, {
					expires: 1,
					secure: true,
				});

				setStatusMessage('Logged in successfully!');
				router.push('/');
			}
		} catch (error: any) {
			setStatusMessage(error.message || 'An error occurred while logging in.');
		}
	};

	return (
		<Box>
			<div className="card login-card">
				<h2 className="login-title">Login</h2>
				<form onSubmit={handleSubmit} name="login_form">
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email:
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="form-control"
							value={formValues.email}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password:
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className="form-control"
							value={formValues.password}
							onChange={handleInputChange}
							required
						/>
					</div>
					<button type="submit" className="btn btn-success btn-login" disabled={loading}>
						{loading ? 'Logging in...' : 'Login'}
					</button>
					{statusMessage && <div className="status-message">{statusMessage}</div>}
				</form>
			</div>
		</Box>
	);
};

export default LoginPage;

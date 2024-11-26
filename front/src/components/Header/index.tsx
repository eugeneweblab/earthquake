'use client';

import cookie from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { useStore } from '@/state/rootProvider';

interface IHeaderProps {}

const Header: FC<IHeaderProps> = () => {
	const { user, userDispatch } = useStore();

	const router = useRouter();

	const logOutHandler = () => {
		userDispatch({
			type: 'DELETE_USER',
			payload: null,
		});

		cookie.remove('earthquakeToken');
		cookie.remove('earthquakeUserData');

		router.push('/login');
	};

	return (
		<header>
			<Navbar bg="light" expand="lg">
				<Container>
					<Navbar.Brand as={Link} href="/">
						My App
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="navbarNav" />

					<Navbar.Collapse id="navbarNav">
						<Nav className="ms-auto">
							{user ? (
								<Nav.Item>
									<span className="me-3">Hello, {user.name}</span>
									<button type="button" className="btn btn-light" onClick={logOutHandler}>
										Sign Out
									</button>
								</Nav.Item>
							) : (
								<Nav.Item>
									<Nav.Link as={Link} href="/login">
										Sign In
									</Nav.Link>
								</Nav.Item>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;

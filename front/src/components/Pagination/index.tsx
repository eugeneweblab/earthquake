'use client';

import React from 'react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
	return (
		<div className="pagination-container d-flex justify-content-center mt-4">
			<nav aria-label="Page navigation">
				<ul className="pagination">
					<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
						<button
							className="page-link"
							onClick={() => onPageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Previous
						</button>
					</li>

					<li className="page-item disabled">
						<span className="page-link">
							Page {currentPage} of {totalPages}
						</span>
					</li>

					<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
						<button
							className="page-link"
							onClick={() => onPageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Pagination;

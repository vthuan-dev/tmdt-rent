import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({
	pages,
	page,
	isAdmin = false,
	keyword = '',
	maxVisible = 5, // Số lượng trang hiển thị tối đa
}) => {
	// Tính toán phạm vi hiển thị
	const startPage = Math.max(1, page - Math.floor(maxVisible / 2))
	const endPage = Math.min(pages, startPage + maxVisible - 1)

	return (
		pages > 1 && (
			<Pagination>
				{/* Nút Previous */}
				{page > 1 && (
					<LinkContainer
						to={
							!isAdmin
								? keyword
									? `/search/${keyword}/page/${page - 1}`
									: `/page/${page - 1}`
								: `/admin/productlist/${page - 1}`
						}
					>
						<Pagination.Prev />
					</LinkContainer>
				)}

				{/* Nút trang đầu tiên */}
				{startPage > 1 && (
					<LinkContainer
						to={
							!isAdmin
								? keyword
									? `/search/${keyword}/page/1`
									: `/page/1`
								: `/admin/productlist/1`
						}
					>
						<Pagination.Item>1</Pagination.Item>
					</LinkContainer>
				)}

				{/* Dấu ... nếu cần */}
				{startPage > 2 && <Pagination.Ellipsis />}

				{/* Nút các trang giữa */}
				{[...Array(endPage - startPage + 1).keys()].map((x) => (
					<LinkContainer
						key={startPage + x}
						to={
							!isAdmin
								? keyword
									? `/search/${keyword}/page/${startPage + x}`
									: `/page/${startPage + x}`
								: `/admin/productlist/${startPage + x}`
						}
					>
						<Pagination.Item active={startPage + x === page}>
							{startPage + x}
						</Pagination.Item>
					</LinkContainer>
				))}

				{/* Dấu ... nếu cần */}
				{endPage < pages - 1 && <Pagination.Ellipsis />}

				{/* Nút trang cuối cùng */}
				{endPage < pages && (
					<LinkContainer
						to={
							!isAdmin
								? keyword
									? `/search/${keyword}/page/${pages}`
									: `/page/${pages}`
								: `/admin/productlist/${pages}`
						}
					>
						<Pagination.Item>{pages}</Pagination.Item>
					</LinkContainer>
				)}

				{/* Nút Next */}
				{page < pages && (
					<LinkContainer
						to={
							!isAdmin
								? keyword
									? `/search/${keyword}/page/${page + 1}`
									: `/page/${page + 1}`
								: `/admin/productlist/${page + 1}`
						}
					>
						<Pagination.Next />
					</LinkContainer>
				)}
			</Pagination>
		)
	)
}

export default Paginate

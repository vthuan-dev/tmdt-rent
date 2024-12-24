import React from 'react'
import { Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'

const Loader = ({ size = 100, color = 'primary', message = 'Đang tải...' }) => {
	return (
		<div
			style={{
				textAlign: 'center',
				margin: 'auto',
				padding: '20px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Spinner
				animation="border"
				role="status"
				style={{
					width: `${size}px`,
					height: `${size}px`,
					color: `var(--bs-${color})`,
				}}
				variant={color}
			/>
			<div style={{ marginTop: '15px', color: `var(--bs-${color})`, fontSize: '1.2em' }}>
				<strong>{message}</strong>
			</div>
		</div>
	)
}

Loader.propTypes = {
	size: PropTypes.number, // Kích thước spinner
	color: PropTypes.string, // Màu sắc spinner (primary, secondary, danger, etc.)
	message: PropTypes.string, // Thông điệp hiển thị
}

export default Loader

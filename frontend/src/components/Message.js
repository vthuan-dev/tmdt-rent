import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'

const Message = ({ variant = 'info', children = 'Thông báo mặc định', dismissible = false, autoHide = 0 }) => {
	const [show, setShow] = useState(true)

	// Tự động ẩn thông báo nếu autoHide > 0
	useEffect(() => {
		if (autoHide > 0) {
			const timer = setTimeout(() => setShow(false), autoHide)
			return () => clearTimeout(timer)
		}
	}, [autoHide])

	// Không hiển thị nếu show = false
	if (!show) return null

	return (
		<Alert
			variant={variant}
			dismissible={dismissible}
			onClose={() => setShow(false)}
			style={{
				display: 'flex',
				alignItems: 'center',
				fontSize: '1rem',
			}}
		>
			{/* Biểu tượng dựa trên variant */}
			<span style={{ marginRight: '10px' }}>
				{variant === 'success' && '✅'}
				{variant === 'danger' && '❌'}
				{variant === 'warning' && '⚠️'}
				{variant === 'info' && 'ℹ️'}
			</span>
			{children}
		</Alert>
	)
}

Message.propTypes = {
	variant: PropTypes.string, // Kiểu thông báo (primary, success, danger, etc.)
	children: PropTypes.node, // Nội dung thông báo
	dismissible: PropTypes.bool, // Có cho phép đóng thông báo hay không
	autoHide: PropTypes.number, // Thời gian tự động ẩn (ms)
}

export default Message

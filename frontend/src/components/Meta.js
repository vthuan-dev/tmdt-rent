import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

const Meta = ({ title, description, keywords, author, image, url }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="author" content={author} />

			{/* Thẻ Open Graph (OG) cho mạng xã hội */}
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			{image && <meta property="og:image" content={image} />}
			{url && <meta property="og:url" content={url} />}
			<meta property="og:type" content="website" />

			{/* Thẻ Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{image && <meta name="twitter:image" content={image} />}
		</Helmet>
	)
}

Meta.defaultProps = {
	title: 'Cửa Hàng Điện Tử | Trang Chủ',
	description: 'Chuyên cung cấp sản phẩm điện tử tốt nhất với giá hợp lý.',
	keywords: 'mua sắm, điện thoại, laptop, điện tử',
	author: 'Pham Khanh',
	image: '/logo.png', // Đường dẫn mặc định cho hình ảnh
	url: '', // URL động có thể đặt bằng Router
}

Meta.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	keywords: PropTypes.string,
	author: PropTypes.string,
	image: PropTypes.string,
	url: PropTypes.string,
}

export default Meta

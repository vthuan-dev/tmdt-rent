import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
} from '../actions/orderActions'
import {
	ORDER_PAY_RESET,
	ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match }) => {
	const orderId = match.params.id

	const [sdkReady, setSdkReady] = useState(false)

	const dispatch = useDispatch()

	const orderDetails = useSelector((state) => state.orderDetails)
	const { order, loading, error } = orderDetails

	const userLogin = useSelector((state) => state.userLogin)
	const { userInfo } = userLogin

	const orderPay = useSelector((state) => state.orderPay)
	const { loading: loadingPay, success: successPay } = orderPay

	const orderDeliver = useSelector((state) => state.orderDeliver)
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver

	if (!loading) {
		// Calculate prices
		// Add two decimals to price if needed
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2)
		}
		// Items price
		order.itemsPrice = addDecimals(
			order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
		)
	}

	useEffect(() => {
		// To get PAYPAL_CLIENT_ID
		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal')
			// Create the script
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
			script.async = true
			script.onload = () => {
				setSdkReady(true)
			}
			document.body.appendChild(script)
		}

		if (!order || successPay || successDeliver || order._id !== orderId) {
			dispatch({ type: ORDER_PAY_RESET })
			dispatch({ type: ORDER_DELIVER_RESET })
			dispatch(getOrderDetails(orderId))
			// if not paid add paypal script
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript()
			} else {
				setSdkReady(true)
			}
		}
	}, [dispatch, orderId, successPay, successDeliver, order]) // Dependencies, on change they fire off useEffect

	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult))
	}

	const deliverHandler = () => {
		dispatch(deliverOrder(order))
	}

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<Link
				// TODO if admin has an order go back to /profile
				to={userInfo.isAdmin ? '/admin/orderlist' : '/profile'}
				className='btn btn-light my-3'
			>
				Quay Lại
			</Link>
			<h1>Order {order._id}</h1>
			<Row>
				{/* Left Steps Summary */}
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Giao Hàng</h2>

							<p>
								<span className='push-to-right'>
									<strong>Tên: </strong> {order.user.name}
								</span>
							</p>

							<p>
								<span className='push-to-right'>
									<strong>Email: </strong>
									<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
								</span>
							</p>

							<p>
								<span className='push-to-right'>
									<strong>Địa Chỉ: </strong>
									{order.shippingAddress.address}, {order.shippingAddress.city}{' '}
									{order.shippingAddress.postalCode},{' '}
									{order.shippingAddress.country}
								</span>
							</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Đã Giao {order.deliveredAt}
								</Message>
							) : (
								<Message variant='danger'>Chưa Giao</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Phương Thức Thanh Toán</h2>
							<p>
								<span className='push-to-right'>
									<strong>Phương Thức: </strong>
									{order.paymentMethod}
								</span>
							</p>
							{order.isPaid ? (
								<Message variant='success'>Đã Thanh Toán {order.paidAt}</Message>
							) : (
								<Message variant='danger'>Chưa Thanh Toán</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Sản Phẩm Trong Giỏ Hàng</h2>
							{order.orderItems.length === 0 ? (
								<Message>Giỏ Hàng Của Bạn Trống</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x {item.price} VNĐ = {item.qty * item.price} VNĐ
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				{/* Right Order Summary */}
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Tóm Tắt Đơn Hàng</h2>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>Sản Phẩm</Col>
									<Col>{order.itemsPrice} VNĐ</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>Giao Hàng</Col>
									<Col>{order.shippingPrice} VNĐ</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>Thuế</Col>
									<Col>{order.taxPrice} VNĐ</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item className='push-to-right'>
								<Row>
									<Col>
										<strong>Tổng</strong>
									</Col>
									<Col>
										<strong>{order.totalPrice} VNĐ</strong>
									</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										<PayPalButton
											amount={order.totalPrice}
											onSuccess={successPaymentHandler}
										/>
									)}
								</ListGroup.Item>
							)}
							{loadingDeliver && <Loader />}
							{userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<Button
										type='button'
										className='btn btn-block'
										onClick={deliverHandler}
									>
										Đánh Dấu Là Đã Giao
									</Button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen

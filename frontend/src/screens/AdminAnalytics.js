import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Image, Button } from 'react-bootstrap';
import { listProducts } from '../actions/productActions';
import { listOrders } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AdminAnalytics = ({ history }) => {
  const dispatch = useDispatch();

  // Lấy dữ liệu sản phẩm
  const productList = useSelector((state) => state.productList);
  const { loading: loadingProducts, error: errorProducts, products } = productList;

  // Lấy dữ liệu đơn hàng
  const orderList = useSelector((state) => state.orderList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderList;

  useEffect(() => {
    // Gửi yêu cầu lấy dữ liệu sản phẩm và đơn hàng
    dispatch(listProducts());
    dispatch(listOrders());
  }, [dispatch]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9' }}>
      {/* Nút Quay lại */}
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => history.goBack()}
      >
        <i className="fas fa-arrow-left"></i> Quay lại
      </Button>
      
      {/* Thống kê tồn kho */}
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Thống Kê Tồn Kho</h1>
      {loadingProducts ? (
        <Loader />
      ) : errorProducts ? (
        <Message variant="danger">{errorProducts}</Message>
      ) : (
        <Table bordered hover responsive className="table-sm" style={{ marginBottom: '50px', width: '90%', margin: 'auto' }}>
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>ID Sản Phẩm</th>
              <th>Tồn Kho</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td style={{ textAlign: 'center' }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fluid
                    rounded
                    style={{ maxWidth: '80px' }}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>{product._id}</td>
                <td style={{ textAlign: 'center' }}>{product.countInStock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Thống kê lịch sử mua hàng */}
      <h1 style={{ textAlign: 'center', margin: '50px 0 30px' }}>Thống Kê Lịch Sử Mua Hàng</h1>
      {loadingOrders ? (
        <Loader />
      ) : errorOrders ? (
        <Message variant="danger">{errorOrders}</Message>
      ) : (
        <Table bordered hover responsive className="table-sm" style={{ margin: 'auto', width: '90%' }}>
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>ID Đơn Hàng</th>
              <th>Tên Người Dùng</th>
              <th>Ngày Tạo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={{ textAlign: 'center' }}>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <Image
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      fluid
                      rounded
                      style={{ width: '50px', height: '50px' }}
                    />
                  ) : (
                    <i
                      className="fas fa-box"
                      style={{ fontSize: '2rem', color: 'gray' }}
                    ></i>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>{order._id}</td>
                <td style={{ textAlign: 'center' }}>{order.user && order.user.name}</td>
                <td style={{ textAlign: 'center' }}>{order.createdAt.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminAnalytics;

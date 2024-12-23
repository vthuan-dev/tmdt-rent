import React from 'react';


const Dashboard = () => {
  const totalUsers = 12;
  const totalProducts = 15;
  const totalOrders = 20;
  const totalRevenue = 152900000; // In VND

  const orderStats = [
    { name: 'Amazon', logo: '/images/brand-logo/amazon.svg', change:  4.8 },
    { name: 'Spotify', logo: '/images/brand-logo/spotify.svg', change: - 0.8 },
    { name: 'PayPal', logo: '/images/brand-logo/paypal.svg', change: + 2.1 },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bảng Quản Trị</h1>
      </header>

      <section className="stats-section">
        <div className="stats-card users-card">
          <h2>{totalUsers}</h2>
          <p>Người Dùng</p>
          <button
            className="manage-btn"
            onClick={() => window.location.href = '/admin/userlist'}>
            Quản Lý
          </button>
        </div>
        <div className="stats-card products-card">
          <h2>{totalProducts}</h2>
          <p>Sản Phẩm</p>
          <button
            className="manage-btn"
            onClick={() => window.location.href = '/admin/productlist'}>
            Quản Lý
          </button>
        </div>
        <div className="stats-card orders-card">
          <h2>{totalOrders}</h2>
          <p>Đơn Hàng</p>
          <button
            className="manage-btn"
            onClick={() => window.location.href = '/admin/orderlist'}>
            Quản Lý
          </button>
        </div>
        <div className="stats-card revenue-card">
          <h2>{totalRevenue.toLocaleString('vi-VN')} VND</h2>
          <p>Doanh Thu</p>
        </div>
      </section>

      <section className="order-stats-section">
        <h2>Đơn Hàng Theo Hãng</h2>
        <div className="order-stats-cards">
          {orderStats.map((order, index) => (
            <div key={index} className="order-stats-card">
              <img src={order.logo} alt={order.name} className="order-logo" />
              <h3>{order.name}</h3>
              <p className={order.change >= 0 ? 'positive-change' : 'negative-change'}>
                {order.change}% Từ Hôm Qua
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="quick-links-section">
        <div className="quick-link-cards">
          {[
            { text: 'Thống Kê', link: '/admin/analytics' },
            { text: 'Quản Lý Người Dùng', link: '/admin/userlist' },
            { text: 'Quản Lý Sản Phẩm', link: '/admin/productlist' },
            { text: 'Quản Lý Đơn Hàng', link: '/admin/orderlist' },
          ].map((item, index) => (
            <div key={index} className="quick-link-card">
              <p>{item.text}</p>
              <button
                className="navigate-btn"
                onClick={() => window.location.href = item.link}>
                Đi Đến
              </button>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default Dashboard;

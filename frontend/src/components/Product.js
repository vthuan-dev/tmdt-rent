import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import Rating from './Rating';

const Product = ({ product }) => {
  // Kiểm tra trạng thái sản phẩm
  const isInStock = product.countInStock > 0;

  return (
    <Card className="my-3 p-3 rounded shadow-sm product-card">
      {/* Badge trạng thái */}
      {!isInStock && (
        <Badge
          bg="danger"
          className="position-absolute top-0 start-0 m-2 px-3 py-2 fs-6"
        >
          
        </Badge>
      )}
      {product.isNew && (
        <Badge
          bg="success"
          className="position-absolute top-0 end-0 m-2 px-3 py-2 fs-6"
        >
          Mới
        </Badge>
      )}
      {product.isOnSale && (
        <Badge
          bg="warning"
          className="position-absolute top-0 end-0 m-2 px-3 py-2 fs-6"
        >
          Giảm giá
        </Badge>
      )}

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="product-link">
        <Card.Img
          src={product.image}
          variant="top"
          className="product-img"
          alt={`${product.name} - ${product.brand}`}
          loading="lazy" // Lazy load hình ảnh
        />
      </Link>

      {/* Product Content */}
      <Card.Body className="product-body">
        {/* Product Name */}
        <Link to={`/product/${product._id}`} className="product-link">
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* Product Brand */}
        <Card.Text as="div" className="product-brand text-muted">
          Thương hiệu: <strong>{product.brand}</strong>
        </Card.Text>

        {/* Product Rating */}
        <Card.Text as="div" className="product-rating">
          <Rating
            value={product.rating}
            text={`${product.numReviews} đánh giá`}
            color="#f8e825"
          />
        </Card.Text>

        {/* Product Price */}
        <Card.Text
          as="h3"
          className={`product-price ${product.isOnSale ? 'text-danger' : 'text-success'}`}
        >
          {new Intl.NumberFormat('vi-VN').format(product.price)} VNĐ
          {product.isOnSale && (
            <span className="ms-2 text-muted text-decoration-line-through">
              {new Intl.NumberFormat('vi-VN').format(product.originalPrice)} VNĐ
            </span>
          )}
        </Card.Text>

        {/* Stock Information */}
        <Card.Text
          as="div"
          className={`product-stock ${isInStock ? 'text-success' : 'text-danger'}`}
        >
          {isInStock ? `Còn ${product.countInStock} sản phẩm` : 'Hết hàng'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;

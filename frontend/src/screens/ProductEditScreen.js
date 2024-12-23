import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showDetails, setShowDetails] = useState(true); // Trạng thái ẩn/hiện thông tin

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push('/admin/productlist');
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setPreviewImage(product.image);
        setBrand(product.brand);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, history, productId, product, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data);
      setPreviewImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !price || !brand || !description) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        countInStock,
        description,
      })
    );
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Quay Lại
      </Link>
      <FormContainer>
        <h1>Thông Tin Sản Phẩm</h1>
        <Button
          variant='secondary'
          className='my-3'
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Ẩn Thông Tin Sản Phẩm' : 'Hiện Thông Tin Sản Phẩm'}
        </Button>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          showDetails && (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Nhập tên sản phẩm'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='price'>
                <Form.Label>Giá (VND)</Form.Label>
                <Form.Control
                  type='number'
                  min='0'
                  placeholder='Nhập giá sản phẩm'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='image'>
                <Form.Label>Ảnh</Form.Label>
                {previewImage && (
                  <div className='mb-3'>
                    <Image src={previewImage} alt='preview' fluid rounded />
                  </div>
                )}
                <Form.Control
                  type='text'
                  placeholder='Nhập đường dẫn ảnh'
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setPreviewImage(e.target.value);
                  }}
                ></Form.Control>
                <Form.File
                  id='image-file'
                  label='Tải ảnh lên'
                  custom
                  onChange={uploadFileHandler}
                ></Form.File>
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group controlId='brand'>
                <Form.Label>Thương Hiệu</Form.Label>
                <Form.Control
                  as='select'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option>Apple</option>
                  <option>Sony</option>
                  <option>Samsung</option>
                  <option>Xiaomi</option>
                  <option>Bose</option>
                  <option>Herschel</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId='countInStock'>
                <Form.Label>Số Lượng</Form.Label>
                <Form.Control
                  type='number'
                  min='0'
                  placeholder='Nhập số lượng'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='description'>
                <Form.Label>Mô Tả</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Nhập mô tả sản phẩm'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary'>
                Cập Nhật
              </Button>
            </Form>
          )
        )}
      </FormContainer>
    </>
  );
};

export default ProductScreen;

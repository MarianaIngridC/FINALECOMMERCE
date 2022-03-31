import React, { useState, useEffect, useReducer } from 'react';
import {Link} from 'react-router-dom';
//import data from '../data';
import axios from 'axios';
import logger from 'use-reducer-logger'
import Product from '../components/Product';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Loading from '../components/Loading';
import MessageBox from '../components/MessageBox';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_SUCCESS':
    return {
      ...state,
      products: action.payload,
      loading: false
    };
    case 'FETCH_FAIL':
    return {
      ...state,
      loading: false,
      error: action.payload
    };
    default:
      return state;
  }
}


const HomeScreen = () => {
  const [{loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [], loading: true, error: '',
  })


  useEffect(() => {
    const fetchData = async() => {
      dispatch({ type: 'FETCH_REQUEST'});
      try {
        const result = await axios.get('/api/products')
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data});
      } catch(err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
      };
    fetchData();
  }, [])

  return (
    <div>
      <Helmet>
        <title>Ecommerce</title>
      </Helmet>
      <h1>Featured Products</h1>
          <div className='products'>
          {
            loading ? (
            <Loading/>
            ) : error ? (
              <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
            <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
                <Product product={product}></Product>
              </Col>
            ))
            }
            </Row>
            )
          }
          </div>
    </div>
  )
}

export default HomeScreen
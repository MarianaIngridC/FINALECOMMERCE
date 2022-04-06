import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import { Button, Col, Row } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import Rating from '../components/Rating';
import { LinkContainer } from 'react-router-bootstrap';

const reducer = (state, action) => {
  console.log(action.payload)
  switch(action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true};
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts:action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
};
const prices = [
  {
    name: '$1 to $50',
    value: '1-50'
  },
  {
    name: '$51 to $200',
    value: '51-200'
  },
  {
    name: '$201 to $1000',
    value: '201-1000'
  },
];
export const ratings = [
  {
    name: '4stars & up',
    rating: 4
  },
  {
    name: '3stars & up',
    rating: 3
  },
  {
    name: '2stars & up',
    rating: 2
  },
  {
    name: '1stars & up',
    rating: 1
  },
]

const SearchScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchp = new URLSearchParams(search);
  const category = searchp.get('category') || 'all';
  const query = searchp.get('query') || 'all';
  const price = searchp.get('price') || 'all';
  const rating = searchp.get('rating') || 'all';
  const order = searchp.get('order') || 'newest';
  const page = searchp.get('page') || 1;

  const [{loading, error, products, pages, countProducts}, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })
  console.log(products)
  console.log(loading)

  useEffect(() => {
    const fetchData = async() => {
      try {
        const { data } = await axios.get(`/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
        console.log(data)
        dispatch({type:'FETCH_SUCCESS', payload: data})

      } catch(err) {
        dispatch({type:'FETCH_FAIL', payload: getError(err)})
      }
    };
    fetchData();
  }, [page, query, category, price, rating, order, error]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const {data} = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch(err) {
        toast.error(getError(err));
      }
    }
    fetchCategories();
  }, [dispatch]);
  console.log(products)
  console.log(page)

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const filterOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}`;
  }
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h3>Department</h3>
          <div>
            <ul>
              <li>
                <Link
                className={'all' === category ? 'text-bold' : ''}
                to={getFilterUrl({category: 'all'})}>
                  Any
                </Link>
              </li>
              {categories.map((cat)=> {
                <li key={cat}>
                  <Link
                    className={cat === category ? 'text-bold' : ''}
                    to={getFilterUrl({category: cat})}
                  >
                    {cat}
                  </Link>
                </li>
              })}
            </ul>
          </div>
          <div>
            <h3>Price</h3>
            <ul>
              <li>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({price: 'all'})}
                >Any</Link>
              </li>
              {prices.map((p)=> (
                <li key={p.value}>
                  <Link
                    className={p.value === price ? 'text-bold' : ''}
                  to={getFilterUrl({price: p.value})}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r)=> (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({rating: r.rating})}
                    className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                  >
                    <Rating caption={' & up'} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                    to={getFilterUrl({rating: 'all'})}
                    className={rating === 'all' ? 'text-bold' : ''}
                >
                  <Rating caption={' & up'} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <Loading></Loading>
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <>
              <Row className='justify-content-between mb-3'>
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <Button
                        variant='light'
                        onClick={()=> navigate('/search')}
                      >
                        <i className='fas fa-times-circle'></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className='text-end'>
                  Sort by{' '}
                  <select
                    value={order}
                    onChange={(e)=>{
                      navigate(getFilterUrl({ order: e.target.value }))
                    }}
                  >
                    <option value='newest'>Newest Arrivals" </option>
                    <option value='lowest'>Price: Low to High</option>
                    <option value='highest'>Price: Hight to Low</option>
                    <option value='toprated'>Avg. Customer Review</option>
                  </select>
                </Col>
              </Row>
              {console.log(products)}
              {console.log(loading)}
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
              {products.map((product) => (
                <Col sm={6} lg={4} className='mb-3' key={product._id}>
                  <Product product={product}></Product>
                </Col>
              ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x)=> (
                  <LinkContainer
                    key={x+1}
                    className='mx-1'
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant='light'
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
           </>
          )}
        </Col>
      </Row>

    </div>
  )
}

export default SearchScreen
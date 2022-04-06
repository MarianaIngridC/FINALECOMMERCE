import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(query)
    navigate(query ? `/search/?query=${query}` : '/search')
  };

  return (
    <Form 
      className='d-flex me-auto'
      onSubmit={submitHandler}
    >
      <InputGroup>
        <FormControl
          type='text'
          name='q'
          id='q'
          onChange={(e)=>setQuery(e.target.value)}
          placeholder='Search products...'
          aria-label='Search products'
          aria-describedby='button-search'
        ></FormControl>
        <Button variant='btn-outline-primary' type='submit' id='button-search'>
          <i className='fas fa-search'></i>
        </Button>
      </InputGroup>
    </Form>
  )
}

export default SearchBox
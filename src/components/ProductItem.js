import React from 'react'

const ProductItem = ({ category, hello, setHello }) => {
  return <div onClick={() => setHello(!hello)}>{category}</div>
}

export default ProductItem

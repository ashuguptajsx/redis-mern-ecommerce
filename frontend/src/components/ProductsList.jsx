import React from 'react'
import { useProductStore } from '../stores/useProductStore'




const ProductList = () => {

  const {deleteProduct, toggleFeaturedProduct, products} = useProductStore();
  
  console.log("products", products);

   
  return (
    <div>

    </div>
  )
}

export default ProductList;
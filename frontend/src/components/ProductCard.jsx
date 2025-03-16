import React from 'react'
import toast from 'react-hot-toast'
import {ShoppingCart} from "lucide-react"

const ProductCard = () => {
  return (
    <div className='flex w-full relative flex-col overflow-hidden border-gray-700 shadow-lg rounded-lg'>
      <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product.image} alt='product image' />
				<div className='absolute inset-0 bg-black bg-opacity-20' />
			</div>

    </div>
  )
}

export default ProductCard
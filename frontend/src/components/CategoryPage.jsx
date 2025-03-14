 import React, { useEffect } from 'react'
 import { useParams } from 'react-router-dom'
import { useProductStore } from '../stores/useProductStore'



 
 const CategoryPage = () => {
    const{fetchProductsByCategory, products} = useProductStore();

    const {category} = useParams(); 

    useEffect(()=>{
        fetchProductsByCategory("shoes");
    },[fetchProductsByCategory])

    console.log("Products : ", products); 
   return (
     <div className='text-white'>CategoryPage</div>
   )
 }
 
 export default CategoryPage

 
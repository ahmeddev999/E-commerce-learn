import React from 'react'
import { href } from 'react-router-dom'
import CategoryItem from '../components/CategoryItem.jsx'


// drust krdni arrayak la category
const categories = [
  {href: "/jeans", name: "Jeans", imgUrl: "/jeans.jpg"},
  {href: "/tshirts", name: "T-shirts", imgUrl: "/tshirts.jpg"},
  {href: "/shoes", name: "Shoes", imgUrl: "/shoes.jpg"},
  {href: "/glasses", name: "Glasses", imgUrl: "/glasses.png"},
  {href: "/jackets", name: "Jackets", imgUrl: "/jackets.jpg"},
  {href: "/suits", name: "Suits", imgUrl: "/suits.jpg"},
  {href: "/bags", name: "Bags", imgUrl: "/bags.jpg"},
]


const HomePage = () => {
  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
            Explore our Categories
        </h1>
        <p className='text-center text-xl text-gray-300 mb-12'>
            Discover the latest trends in eco-friendly fashion
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
           {categories.map((category) => (
            <CategoryItem 
            category={category}
            key={category.name}
            />
           ))}
        </div>
      
      </div>
    </div>
  )
}

export default HomePage

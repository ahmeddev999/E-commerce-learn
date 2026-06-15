import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';;
import { LogIn, Mail, Lock, ArrowRight, Loader, User } from 'lucide-react';

const LoginPage = () => {
  // lerada aw jora state a React darchay bergam lo drustka
  // w dastpeke value kaman ba "" bet
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = false;

  // lo kati submit krdni formakaman
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
  }

  return (
    <div className='fle flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div
      initial={{opacity: 0, y: -20}}
      animate={{opacity: 1, y:0}}
      transition={{duration: 0.8}}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Login your account</h2> 
      </motion.div>

      <motion.div
      className='mt-8 sm:mx-auto sm:max-w-md'
      initial={{opacity: -0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8}}
      >
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>

          <form onSubmit={handleSubmit} className='space-y-6'>

            <div>
            <label htmlFor="email" className='block text-sm font-medium text-gray-300'>
              Email
            </label>

            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 pt-4.5 flex items-center pointer-events-none'>
                <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </div>
            </div>
            <input 
            id='email'
            type="text"
            name='email'
            required
            value={email}
            // loya return bakar naynen chunka lera ama setState dakain pewest man pe nya 
            onChange={(e) => setEmail(e.target.value)}
            className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-md shadow-sm
            placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
            placeholder='email@example.com'
            />
            
            </div>

            <div>
            <label htmlFor="password" className='block text-sm font-medium text-gray-300'>
              Password
            </label>

            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 pt-4.5 flex items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' aria-hidden='true'/>
              </div>
            </div>

            <input 
            type="password" 
            name="password" 
            id="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-md shadow-sm
            placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
            placeholder='********'
            />
            </div>

            {/* loya condintion bakar daynin agar qlak agar loading habu 
                awedekash loway katak load tawaw buwa datwann kare pe bkan */}
            <button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent
            rounded-md shadow-sm font-medium text-white bg-emerald-600 
            hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
            disabled={loading}
            >
              { loading ? ( <>
              <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true'/>
              Loading...
              </>): ( <>
              <User className='mr-2 w-5 h-5' aria-hidden='true'/>
              Login
              </>)}

            </button>

          </form>

        </div>

      </motion.div>
    </div>
  )
}

export default LoginPage
 
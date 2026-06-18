import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion'

// dast pe krdnawa

// fkr krdnawa laway ku nmuna name dachta naw formData
// katak name lanaw inputaka danusret ama lagal previews datakani dadanen
// pashan aw shtay dakain rek lanaw setFromData dakain

// prsyaraka leraya ku name dachetawa jey xoy ku lanaw aw obj {} data konakan dachtawa jey xoy w harwaha name


// react component
const SignUpPage = () => {

  const loading = false;
  // lera da groupe komalla datayake paywast ba yaktr dakain
  // handleChange builds the data step by step,
  // and handleSubmit uses that final data when the user submits.
  const [formData, setFormData] = useState({ //intial state
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  
  const handleSubmit = (e) => {
     e.preventDefault();
     console.log(formData);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div
      initial={{opacity: 0, y: -20}} 
       animate={{opacity: 1, y: 1}}
      transition={{duration: 0.8}}
      >

      <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create your account</h2>

      <motion.div
        className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.8, delay: 0.2}}
      >
         <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'> 

          {/* form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              
              <div>
                {/* htmlFor lo id='name' dandraya */}
                <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
                  Full name
                </label>
                
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 pt-4.5 flex items-center pointer-events-none'>
                      <User className='h-5 w-5 text-gray-400' aria-hidden='true' /> 
                  </div>
                </div>
              <input 
              id='name'
              type="text" 
              name='name'
              required
              value={formData.name}
              // baw jorash dabi onChange={(e) => setFormData({ ...formData, name: e.target.value})}
              onChange={handleChange}
              className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
               placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
              placeholder='Your full name'
              />
              </div>
              
              <div>

                <label htmlFor="email">
                  Email
                </label>
                
                <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 pt-4.5 flex items-center pointer-events-none'>
                        <Mail className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                    </div>
                </div>
                <input 
                id='email'
                type="email"
                name='email'
                required
                value={formData.email}
                onChange={handleChange} 
                className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-md shadow-sm
                placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                placeholder='email@example.com'
                />
              </div>

              <div>

                <label htmlFor="password">
                  Password
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 pt-4.5 flex items-center pointer-events-none'> 
                      {/* pointer-events-none agar click la icon kra hata inputaka har esh bka*/}
                      <Lock className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                    </div>
                </div>
                <input type="password" 
                name="password" 
                id="password" 
                required
                value={formData.password}
                onChange={handleChange}
                className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-md shadow-sm
                placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                placeholder='********'
                />
              </div>

              <div>

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 pt-4.5 flex items-center pointer-events-none'> 
                      {/* pointer-events-none agar click la icon kra hata inputaka har esh bka*/}
                      <Lock className='h-5 w-5 text-gray-400' aria-hidden='true'/>
                    </div>
                </div>
                <input type="password" 
                name="confirmPassword" 
                id="confirmPassword" 
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className='block w-full px-3 py-2 pl-10 bg-gray-700 border-gray-600 rounded-md shadow-sm
                placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                placeholder='********'
                />
              </div>

              <button 
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm font-medium text-white bg-emerald-600
              hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
              disabled={loading}
              >
                { loading ? (
                <>
                  <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                  Loading...
                </> )
                : ( <>
                  <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                  Sign up
                </> )}
              
              </button>

            </form>

            {/* drust krdni agar user accounti habu la asllda videokash tawaw ka*/}
            <p className='mt-8 text-gray-400 text-center text-sm'>
              Already have an account?{" "}
              <Link to={'/login'} className='font-medium text-emerald-400 hover:text-emerald-300'> 
                  login here <ArrowRight className='inline h-4 w-4' />
              </Link>
            </p>
         </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUpPage

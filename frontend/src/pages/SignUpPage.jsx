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

  const loading = true;
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
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
               placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
              placeholder='Ahmed Salim'
              />
              </div>
            </form>

         </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignUpPage

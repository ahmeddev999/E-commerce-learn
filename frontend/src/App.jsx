import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Navbar from './components/Navbar.jsx'


 


const App = () => {
  return (

    // chand classai pe dadain lo appakaman gringa nmuna bchuktren height screenaka bet
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>

      {/* background gradint */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>


    <div className='relative z-50 pt-20'>
    {/* agar deqat bdain ama la hamu pagekan navbar u gradintaki background man hayaloya la daray route dadanin, labar away navbar man fixed a elaqay baw pt-20 da nya*/}
    <Navbar /> 
    {/* lerada Routes dakainawa lo har Routek ka hamana path endpointakaya w element aw bashaya nishani dadayn"If the URL = this path → show this component" */}
    <Routes>

      <Route path='/' element={ <HomePage /> }/>
      <Route path='/signup' element={ <SignUpPage /> }/>
      <Route path='/login' element={ <LoginPage /> }/>

    </Routes>
    </div>
    </div>      
    )
}

export default App

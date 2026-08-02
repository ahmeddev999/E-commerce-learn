import { BarChart, PlusCircle, ShoppingBasket } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CreateProductForm from '../components/CreateProductForm.jsx';
import AnalyticsTab from '../components/AnalyticsTab.jsx';
import ProductList from '../components/ProductList.jsx';


const tabs = [
  {id: "create", label: "Create Product", icon: PlusCircle},
  {id: "product", label: "Products", icon: ShoppingBasket},
  {id: "analytics", label: "Analytics", icon: BarChart},
];

const AdminPage = () => {

  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
      <div className='relative z-10 container mx-auto py-16'>
        <motion.h1
        initial={{ opacity: 0, y: -20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.8}}
        className='text-4xl font-bold mb-8 text-emerald-400 text-center'
        >
          Admin dashboard
        </motion.h1>

        {/* lera tabakan map dakain dana ba dana */}
        <div className='flex justify-center mb-8'>
        {tabs.map((tab) => (
          <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
            activeTab === tab.id
            ? "bg-emerald-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`} 
          >
            <tab.icon className='mr-2 h-5  w-5' />
            {tab.label}
          </button>
        ))}
        </div>
        {/* agar activeTab === yaksan bu baway barambari yani true 
        trush ama lapeshi awaman danaya true be render daka */}
      {activeTab === "create" && <CreateProductForm /> }
      {activeTab === "product" && <ProductList />}
      {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  )
}

// fkraka awaya ama 3 danaman haya w zaydan ama useState haya by defualt lasar create a 
// pashan map kman haya ama la map krdnaka 3 button drust dabi lo har buttonak id xoy pe dadain
// w har 3kyan onclick lasara katak click la kamay bkre awa initial state kaman dagore lo aw tab.id hayte
// tab3an ama awaha dabnin agar na la kati drust buwa => setActiveTab(tab.id) nya bapay har yakaw kamaya
// numna awhay le det => setActiveTab("analytic") dway we laxware chand shtakman haya agar har kama be
// intial stateka aw componentat lo render dakat awkati w zaydan shtashkaman haya lanaw classname awaya
// intial stateka agar yaksanbu baway xot awa kask baka
// numunak ka yakam obj map dakre w ba haman shewa lo awani dekash

        // {tabs.map((tab) => (
        //   <button 
        //   key={"create"}
        //   onClick={() => setActiveTab("create")}
        //   className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
        //     activeTab === "create"
        //     ? "bg-emerald-600 text-white"
        //     : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        //   }`} 
        //   >
        //     <Pluscircle className='mr-2 h-5  w-5' />
        //     {"Create Product"}
        //   </button>
        // ))}
export default AdminPage


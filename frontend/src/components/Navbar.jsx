import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">MBR Events</Link>
        <div className="space-x-4">
          <Link to="/auth" className="text-sm text-gray-700">Login</Link>
          <Link to="/dashboard" className="text-sm text-gray-700">Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}

import React, { useState } from 'react'
import axios from 'axios'

export default function Auth() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(0)

  async function requestOtp() {
    await axios.post('/api/auth/request-otp', { phone })
    setStep(1)
  }

  async function verify() {
    const res = await axios.post('/api/auth/verify-otp', { phone, code })
    localStorage.setItem('token', res.data.token)
    window.location.href = '/dashboard'
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-semibold">Login / Sign up</h2>
      {step === 0 ? (
        <div>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full p-2 border mt-4" />
          <button onClick={requestOtp} className="mt-4 px-4 py-2 bg-blue-600 text-white">Request OTP</button>
        </div>
      ) : (
        <div>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="OTP" className="w-full p-2 border mt-4" />
          <button onClick={verify} className="mt-4 px-4 py-2 bg-green-600 text-white">Verify</button>
        </div>
      )}
    </div>
  )
}

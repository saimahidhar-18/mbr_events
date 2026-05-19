import React, { useEffect, useState } from 'react'
import { fetchInventory, updateInventoryItem } from '../services/adminApi'
import { useStore } from '../store/useStore'
import { connectSocketAsAdmin } from '../services/socket'

function AdminInventoryRow({ item }){
  const updateOptimistic = useStore(state => state.updateInventoryOptimistic)
  const [editing, setEditing] = useState(false)
  const [qty, setQty] = useState(item.totalQty)

  async function save(){
    // optimistic UI
    updateOptimistic(item.id, { totalQty: qty })
    try {
      await updateInventoryItem(item.id, { totalQty: qty })
    } catch (err){
      // revert by refetching inventory (simple strategy)
      window.location.reload()
    }
    setEditing(false)
  }

  return (
    <tr>
      <td className="p-2 border">{item.name}</td>
      <td className="p-2 border">{item.category?.name || '-'}</td>
      <td className="p-2 border">{item.price}</td>
      <td className="p-2 border">
        {editing ? (
          <div className="flex items-center">
            <input type="number" value={qty} onChange={e=>setQty(Number(e.target.value))} className="border p-1 w-24" />
            <button onClick={save} className="ml-2 px-2 py-1 bg-blue-600 text-white">Save</button>
          </div>
        ) : (
          <div className="flex items-center">
            <span>{item.totalQty}</span>
            <button onClick={()=>setEditing(true)} className="ml-2 text-sm text-blue-600">Edit</button>
          </div>
        )}
      </td>
    </tr>
  )
}

export default function AdminDashboard(){
  const setInventory = useStore(state => state.setInventory)
  const inventory = useStore(state => state.inventory)

  useEffect(()=>{ connectSocketAsAdmin() }, [])

  useEffect(()=>{
    fetchInventory().then(items => setInventory(items)).catch(console.error)
  }, [setInventory])

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <section className="mt-6">
        <h3 className="font-semibold">Inventory</h3>
        <table className="w-full mt-2 border-collapse">
          <thead>
            <tr>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Category</th>
              <th className="p-2 border text-left">Price</th>
              <th className="p-2 border text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(i => <AdminInventoryRow key={i.id} item={i} />)}
          </tbody>
        </table>
      </section>
    </div>
  )
}

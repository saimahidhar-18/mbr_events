import api from './api'

export async function fetchInventory() {
  const res = await api.get('/admin/inventory')
  return res.data.items
}

export async function updateInventoryItem(id, body) {
  const res = await api.put(`/admin/inventory/${id}`, body)
  return res.data.updated
}

import { io } from 'socket.io-client'
import { useStore } from '../store/useStore'

const SOCKET_URL = (import.meta.env.VITE_API_URL) || ''

const socket = io(SOCKET_URL || '/', { autoConnect: false })

socket.on('connect', () => console.log('socket connected', socket.id))
socket.on('disconnect', () => console.log('socket disconnected'))

socket.on('inventoryUpdated', (payload) => {
  const { itemId, updated } = payload;
  useStore.getState().applyInventoryUpdate(updated);
})

socket.on('galleryUpdated', (payload) => {
  useStore.getState().prependGalleryImages(payload);
})

socket.on('bookingCreated', (payload) => {
  useStore.getState().prependBooking(payload);
})

export function connectSocketAsAdmin() {
  if (!socket.connected) {
    socket.connect();
    socket.emit('joinAdmin');
  }
}

export default socket

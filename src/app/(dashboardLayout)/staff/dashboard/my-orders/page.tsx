import MyOrders from '@/components/dashboard/my-orders/MyOrders'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders | Oshud Sheba',
  description: 'View and manage your orders on Oshud Sheba.',
}

export default function MyOrdersPage() {
  return <MyOrders />
}

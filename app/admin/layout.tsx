import { Metadata } from 'next'
import { AdminClientLayout } from './client-layout'

export const metadata: Metadata = {
  title: 'Admin Panel | Jharkhand Municipal Dashboard',
  description: 'Administration panel for managing the Jharkhand Municipal Dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>
}
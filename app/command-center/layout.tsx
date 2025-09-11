import { Metadata } from 'next'
import { CommandCenterClientLayout } from './client-layout'

export const metadata: Metadata = {
  title: 'GIS Command Center | Jharkhand Municipal Dashboard',
  description: 'Real-time monitoring and management of municipal issues across Jharkhand',
}

export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CommandCenterClientLayout>{children}</CommandCenterClientLayout>
}

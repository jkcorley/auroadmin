import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { NavLink } from "@/components/nav-link"
import {
  Home,
  Building2,
  Settings2,
  Truck,
  Users,
  Calendar,
  Package,
  BarChart3,
  Map,
  Search,
  List,
} from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Laundromat Admin Console",
  description: "Admin console for managing laundromat operations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "min-h-full bg-background")}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col bg-gray-50 border-r border-gray-200 shadow-md">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3 px-6 pb-2">
                <div className="bg-gray-900 rounded-lg p-2 flex items-center justify-center">
                  <Settings2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg leading-tight">Auro Platform</div>
                  <div className="text-xs text-muted-foreground">Admin Console</div>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />
              {/* Navigation Section */}
              <div className="px-6 pb-2 pt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Navigation</div>
              <nav className="flex-1 px-2 pb-4 space-y-1">
                <NavLink href="/">
                  <span className="flex items-center gap-3"><Home className="h-5 w-5" />Dashboard</span>
                </NavLink>
                <NavLink href="/laundromats">
                  <span className="flex items-center gap-3"><Building2 className="h-5 w-5" />Laundromats</span>
                </NavLink>
                <NavLink href="/laundromats-map">
                  <span className="flex items-center gap-3"><Map className="h-5 w-5" />Laundromats Map</span>
                </NavLink>
                <NavLink href="/laundromats-explore">
                  <span className="flex items-center gap-3"><Search className="h-5 w-5" />Laundromats Explore</span>
                </NavLink>
                <NavLink href="/participating-laundromats">
                  <span className="flex items-center gap-3"><List className="h-5 w-5" />Participating Laundromats</span>
                </NavLink>
                <NavLink href="/machines">
                  <span className="flex items-center gap-3"><Settings2 className="h-5 w-5" />Machines</span>
                </NavLink>
                <NavLink href="/drivers">
                  <span className="flex items-center gap-3"><Truck className="h-5 w-5" />Drivers</span>
                </NavLink>
                <NavLink href="/users">
                  <span className="flex items-center gap-3"><Users className="h-5 w-5" />Users</span>
                </NavLink>
                <NavLink href="/bookings">
                  <span className="flex items-center gap-3"><Calendar className="h-5 w-5" />Bookings</span>
                </NavLink>
                <NavLink href="/orders">
                  <span className="flex items-center gap-3"><Package className="h-5 w-5" />Orders</span>
                </NavLink>
                <NavLink href="/supply-orders">
                  <span className="flex items-center gap-3"><Package className="h-5 w-5" />Supply Orders</span>
                </NavLink>
                <NavLink href="/laundry-products">
                  <span className="flex items-center gap-3"><Package className="h-5 w-5" />Laundry Products</span>
                </NavLink>
                <NavLink href="/analytics">
                  <span className="flex items-center gap-3"><BarChart3 className="h-5 w-5" />Analytics</span>
                </NavLink>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col flex-1">
            {/* Mobile header */}
            <div className="md:hidden bg-card border-b">
              <div className="flex items-center justify-between px-4 py-2">
                <h1 className="text-xl font-bold">Admin Console</h1>
                <button className="p-2 rounded-md hover:bg-muted">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto bg-background px-8 py-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

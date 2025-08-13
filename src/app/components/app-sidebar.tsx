"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { AccountCircleOutlined, Groups3Outlined, BarChartOutlined, SettingsOutlined, HelpOutlineOutlined, LockOutlined } from "@mui/icons-material"
import { Stethoscope } from "lucide-react"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2';
import { getCurrentUser } from '../api/api_auth';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react'; //icon
const mainMenuItems = [
  { title: "จัดการผู้ป่วย", icon: AccountCircleOutlined, url: "/patient" },
  { title: "จัดการพยาบาล", icon: Groups3Outlined, url: "/nurse" },
  { title: "ระบบรายงาน", icon: BarChartOutlined, url: "/reports" },
  { title: "ระบบคิวติดตามสถานะผู้ป่วย", icon: BarChartOutlined, url: "/Queue" },
]

const systemMenuItems = [
  { title: "การตั้งค่า", icon: SettingsOutlined, url: "/settings" },
  { title: "ประวัติการเข้าใช้งาน", icon: SettingsOutlined, url: "/log" },
]

export function AppSidebar() {
  const router = useRouter()
  const [fullname, setfullname] = useState<string | null>(null);
  const [type, settype] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3333/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'เกิดข้อผิดพลาดขณะออกจากระบบ',
        });
        return
      }

      const result = await res.json();
      await Swal.fire({
        icon: result.status,
        title: result.message,
        showConfirmButton: false,
        timer: 1000,
      });

      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user) {
        setfullname(user.fullname);
        settype(user.type);
      }
    }
    fetchUser();
  }, []);


  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">ระบบเวชระเบียน</h2>
            <p className="text-sm text-muted-foreground">Medical Records</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>เมนูหลัก</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>ระบบ</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="flex items-center gap-3 cursor-pointer">
                  <LockOutlined className="h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {type == "nurse" ? (
                <Icon icon="solar:medical-kit-bold" width={42} height={42} color="#3B82F6"></Icon>
              ) : (
                <Icon icon="material-symbols:logo-dev-rounded" width={42} height={42} color="#3B82F6"></Icon>
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium truncate">{fullname}</p>
            <p className="text-base text-muted-foreground truncate">{type}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

import { 
  Home, 
  Users, 
  FolderOpen, 
  Calculator, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  Building2
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'

interface AppSidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
}

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Projetos',
    url: '/projetos',
    icon: FolderOpen,
  },
  {
    title: 'Orçamentos',
    url: '/orcamentos',
    icon: Calculator,
  },
  {
    title: 'Cronogramas',
    url: '/cronogramas',
    icon: Calendar,
  },
  {
    title: 'Comunicação',
    url: '/comunicacao',
    icon: MessageSquare,
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3,
  },
]

export function AppSidebar({ activeItem, onItemClick }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border bg-card">
        <div className="flex items-center gap-2 px-4 py-4">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">ArchiCRM</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onItemClick(item.url)}
                    isActive={activeItem === item.url}
                    className="w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
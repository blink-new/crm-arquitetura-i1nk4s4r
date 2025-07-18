import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  FolderOpen, 
  Calculator, 
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react'
import { blink } from '@/blink/client'

interface DashboardStats {
  totalClientes: number
  projetosAtivos: number
  orcamentosAbertos: number
  receitaMes: number
}

interface RecentProject {
  id: string
  nome: string
  cliente: string
  status: 'Em Andamento' | 'Aguardando Aprovação' | 'Concluído' | 'Pausado'
  prazo: string
  valor: number
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    projetosAtivos: 0,
    orcamentosAbertos: 0,
    receitaMes: 0
  })
  
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simular dados por enquanto - depois conectaremos com o banco
      setStats({
        totalClientes: 24,
        projetosAtivos: 8,
        orcamentosAbertos: 5,
        receitaMes: 125000
      })

      setRecentProjects([
        {
          id: '1',
          nome: 'Casa Moderna Alphaville',
          cliente: 'João Silva',
          status: 'Em Andamento',
          prazo: '2024-08-15',
          valor: 45000
        },
        {
          id: '2',
          nome: 'Reforma Apartamento Centro',
          cliente: 'Maria Santos',
          status: 'Aguardando Aprovação',
          prazo: '2024-07-30',
          valor: 28000
        },
        {
          id: '3',
          nome: 'Escritório Comercial',
          cliente: 'Empresa ABC',
          status: 'Em Andamento',
          prazo: '2024-09-10',
          valor: 65000
        }
      ])
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800'
      case 'Aguardando Aprovação':
        return 'bg-yellow-100 text-yellow-800'
      case 'Concluído':
        return 'bg-green-100 text-green-800'
      case 'Pausado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral dos seus projetos e negócios
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              +2 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projetosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              3 iniciados esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamentos Abertos</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orcamentosAbertos}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.receitaMes)}</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
            <CardDescription>
              Acompanhe o status dos seus projetos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{project.nome}</p>
                    <p className="text-sm text-muted-foreground">Cliente: {project.cliente}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Prazo: {formatDate(project.prazo)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <p className="text-sm font-medium">{formatCurrency(project.valor)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm">Novo orçamento criado</p>
                  <p className="text-xs text-muted-foreground">Casa Moderna Alphaville - há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm">Projeto aprovado</p>
                  <p className="text-xs text-muted-foreground">Reforma Apartamento Centro - há 4 horas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm">Cliente adicionado</p>
                  <p className="text-xs text-muted-foreground">Maria Santos - há 1 dia</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm">Reunião agendada</p>
                  <p className="text-xs text-muted-foreground">João Silva - há 2 dias</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Novo Cliente</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FolderOpen className="h-6 w-6" />
              <span>Novo Projeto</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calculator className="h-6 w-6" />
              <span>Criar Orçamento</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Agendar Reunião</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Projeto {
  id: string
  nome: string
  cliente: string
  status: 'Em Andamento' | 'Aguardando Aprovação' | 'Concluído' | 'Pausado' | 'Cancelado'
  tipo: 'Residencial' | 'Comercial' | 'Industrial' | 'Reforma'
  dataInicio: string
  prazo: string
  valor: number
  progresso: number
  descricao: string
}

export function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [tipoFilter, setTipoFilter] = useState<string>('todos')

  useEffect(() => {
    loadProjetos()
  }, [])

  const loadProjetos = async () => {
    try {
      // Dados simulados - depois conectaremos com o banco
      const projetosData: Projeto[] = [
        {
          id: '1',
          nome: 'Casa Moderna Alphaville',
          cliente: 'João Silva',
          status: 'Em Andamento',
          tipo: 'Residencial',
          dataInicio: '2024-06-01',
          prazo: '2024-08-15',
          valor: 450000,
          progresso: 65,
          descricao: 'Projeto de casa moderna com 3 suítes, piscina e área gourmet'
        },
        {
          id: '2',
          nome: 'Reforma Apartamento Centro',
          cliente: 'Maria Santos',
          status: 'Aguardando Aprovação',
          tipo: 'Reforma',
          dataInicio: '2024-07-01',
          prazo: '2024-07-30',
          valor: 280000,
          progresso: 25,
          descricao: 'Reforma completa de apartamento de 120m² no centro da cidade'
        },
        {
          id: '3',
          nome: 'Escritório Comercial',
          cliente: 'Empresa ABC Ltda',
          status: 'Em Andamento',
          tipo: 'Comercial',
          dataInicio: '2024-05-15',
          prazo: '2024-09-10',
          valor: 650000,
          progresso: 80,
          descricao: 'Projeto de escritório corporativo com 500m² e 50 estações de trabalho'
        },
        {
          id: '4',
          nome: 'Residência Condomínio',
          cliente: 'Carlos Oliveira',
          status: 'Concluído',
          tipo: 'Residencial',
          dataInicio: '2024-03-01',
          prazo: '2024-06-30',
          valor: 380000,
          progresso: 100,
          descricao: 'Casa térrea com 4 quartos em condomínio fechado'
        },
        {
          id: '5',
          nome: 'Loja Shopping',
          cliente: 'Retail Store',
          status: 'Pausado',
          tipo: 'Comercial',
          dataInicio: '2024-04-01',
          prazo: '2024-08-01',
          valor: 220000,
          progresso: 40,
          descricao: 'Projeto de loja de roupas em shopping center'
        }
      ]
      
      setProjetos(projetosData)
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
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
      case 'Cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Residencial':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Comercial':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Industrial':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Reforma':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
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

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || projeto.status === statusFilter
    const matchesTipo = tipoFilter === 'todos' || projeto.tipo === tipoFilter
    
    return matchesSearch && matchesStatus && matchesTipo
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
          <p className="text-muted-foreground">
            Gerencie todos os seus projetos arquitetônicos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos ou clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Aguardando Aprovação">Aguardando Aprovação</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Pausado">Pausado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="Residencial">Residencial</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Reforma">Reforma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjetos.map((projeto) => (
          <Card key={projeto.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{projeto.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {projeto.cliente}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(projeto.status)}>
                  {projeto.status}
                </Badge>
                <Badge variant="outline" className={getTipoColor(projeto.tipo)}>
                  {projeto.tipo}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {projeto.descricao}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{projeto.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${projeto.progresso}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Prazo
                  </div>
                  <p className="text-sm font-medium">{formatDate(projeto.prazo)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    Valor
                  </div>
                  <p className="text-sm font-medium">{formatCurrency(projeto.valor)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjetos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'todos' || tipoFilter !== 'todos'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro projeto'
                }
              </p>
              {!searchTerm && statusFilter === 'todos' && tipoFilter === 'todos' && (
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Projeto
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
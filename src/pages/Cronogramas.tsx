import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { blink } from '@/blink/client'

interface Tarefa {
  id: string
  nome: string
  descricao: string
  dataInicio: string
  dataFim: string
  status: 'Não Iniciada' | 'Em Andamento' | 'Concluída' | 'Atrasada' | 'Pausada'
  responsavel: string
  progresso: number
  dependencias: string[]
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica'
}

interface Cronograma {
  id: string
  nome: string
  projeto: string
  cliente: string
  dataInicio: string
  dataFim: string
  status: 'Planejamento' | 'Em Andamento' | 'Concluído' | 'Atrasado' | 'Pausado'
  progresso: number
  descricao: string
  tarefas: Tarefa[]
}

export function Cronogramas() {
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCronograma, setEditingCronograma] = useState<Cronograma | null>(null)
  const [selectedCronograma, setSelectedCronograma] = useState<Cronograma | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    projeto: '',
    cliente: '',
    dataInicio: '',
    dataFim: '',
    descricao: ''
  })

  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [novaTarefa, setNovaTarefa] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    responsavel: '',
    prioridade: 'Média' as 'Baixa' | 'Média' | 'Alta' | 'Crítica'
  })

  useEffect(() => {
    loadCronogramas()
  }, [])

  const loadCronogramas = async () => {
    try {
      // Dados simulados - depois conectaremos com o banco
      const cronogramasData: Cronograma[] = [
        {
          id: '1',
          nome: 'Cronograma Casa Alphaville',
          projeto: 'Casa Moderna Alphaville',
          cliente: 'João Silva',
          dataInicio: '2024-06-01',
          dataFim: '2024-08-15',
          status: 'Em Andamento',
          progresso: 65,
          descricao: 'Cronograma completo para construção da casa moderna',
          tarefas: [
            {
              id: '1',
              nome: 'Fundação',
              descricao: 'Escavação e concretagem da fundação',
              dataInicio: '2024-06-01',
              dataFim: '2024-06-15',
              status: 'Concluída',
              responsavel: 'Equipe de Fundação',
              progresso: 100,
              dependencias: [],
              prioridade: 'Crítica'
            },
            {
              id: '2',
              nome: 'Estrutura',
              descricao: 'Montagem da estrutura de concreto',
              dataInicio: '2024-06-16',
              dataFim: '2024-07-05',
              status: 'Concluída',
              responsavel: 'Equipe Estrutural',
              progresso: 100,
              dependencias: ['1'],
              prioridade: 'Crítica'
            },
            {
              id: '3',
              nome: 'Alvenaria',
              descricao: 'Construção das paredes',
              dataInicio: '2024-07-06',
              dataFim: '2024-07-25',
              status: 'Em Andamento',
              responsavel: 'Pedreiros',
              progresso: 80,
              dependencias: ['2'],
              prioridade: 'Alta'
            },
            {
              id: '4',
              nome: 'Instalações',
              descricao: 'Instalações elétricas e hidráulicas',
              dataInicio: '2024-07-20',
              dataFim: '2024-08-05',
              status: 'Em Andamento',
              responsavel: 'Eletricistas e Encanadores',
              progresso: 40,
              dependencias: ['3'],
              prioridade: 'Alta'
            },
            {
              id: '5',
              nome: 'Acabamentos',
              descricao: 'Pintura e acabamentos finais',
              dataInicio: '2024-08-06',
              dataFim: '2024-08-15',
              status: 'Não Iniciada',
              responsavel: 'Equipe de Acabamento',
              progresso: 0,
              dependencias: ['4'],
              prioridade: 'Média'
            }
          ]
        },
        {
          id: '2',
          nome: 'Cronograma Reforma Apartamento',
          projeto: 'Reforma Apartamento Centro',
          cliente: 'Maria Santos',
          dataInicio: '2024-07-01',
          dataFim: '2024-07-30',
          status: 'Planejamento',
          progresso: 15,
          descricao: 'Cronograma para reforma completa do apartamento',
          tarefas: [
            {
              id: '1',
              nome: 'Demolição',
              descricao: 'Demolição de paredes não estruturais',
              dataInicio: '2024-07-01',
              dataFim: '2024-07-05',
              status: 'Em Andamento',
              responsavel: 'Equipe de Demolição',
              progresso: 60,
              dependencias: [],
              prioridade: 'Alta'
            },
            {
              id: '2',
              nome: 'Instalações Novas',
              descricao: 'Novas instalações elétricas e hidráulicas',
              dataInicio: '2024-07-06',
              dataFim: '2024-07-15',
              status: 'Não Iniciada',
              responsavel: 'Técnicos Especializados',
              progresso: 0,
              dependencias: ['1'],
              prioridade: 'Crítica'
            }
          ]
        },
        {
          id: '3',
          nome: 'Cronograma Escritório Comercial',
          projeto: 'Escritório Comercial',
          cliente: 'Empresa ABC',
          dataInicio: '2024-05-15',
          dataFim: '2024-09-10',
          status: 'Em Andamento',
          progresso: 80,
          descricao: 'Cronograma para construção do escritório corporativo',
          tarefas: []
        }
      ]
      
      setCronogramas(cronogramasData)
    } catch (error) {
      console.error('Erro ao carregar cronogramas:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejamento':
        return 'bg-gray-100 text-gray-800'
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800'
      case 'Concluído':
        return 'bg-green-100 text-green-800'
      case 'Atrasado':
        return 'bg-red-100 text-red-800'
      case 'Pausado':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'Não Iniciada':
        return 'bg-gray-100 text-gray-800'
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800'
      case 'Concluída':
        return 'bg-green-100 text-green-800'
      case 'Atrasada':
        return 'bg-red-100 text-red-800'
      case 'Pausada':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Baixa':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Média':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Alta':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'Crítica':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Não Iniciada':
        return <Clock className="h-4 w-4" />
      case 'Em Andamento':
        return <PlayCircle className="h-4 w-4" />
      case 'Concluída':
        return <CheckCircle className="h-4 w-4" />
      case 'Atrasada':
        return <AlertCircle className="h-4 w-4" />
      case 'Pausada':
        return <PauseCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calcularProgresso = (tarefas: Tarefa[]) => {
    if (tarefas.length === 0) return 0
    const totalProgresso = tarefas.reduce((sum, tarefa) => sum + tarefa.progresso, 0)
    return Math.round(totalProgresso / tarefas.length)
  }

  const filteredCronogramas = cronogramas.filter(cronograma => {
    const matchesSearch = cronograma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cronograma.projeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cronograma.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || cronograma.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const adicionarTarefa = () => {
    if (!novaTarefa.nome) return

    const tarefa: Tarefa = {
      id: Date.now().toString(),
      ...novaTarefa,
      status: 'Não Iniciada',
      progresso: 0,
      dependencias: []
    }

    setTarefas(prev => [...prev, tarefa])
    setNovaTarefa({
      nome: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      responsavel: '',
      prioridade: 'Média'
    })
  }

  const removerTarefa = (id: string) => {
    setTarefas(prev => prev.filter(tarefa => tarefa.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const novoCronograma: Cronograma = {
        id: editingCronograma ? editingCronograma.id : Date.now().toString(),
        ...formData,
        status: 'Planejamento',
        progresso: calcularProgresso(tarefas),
        tarefas: [...tarefas]
      }

      if (editingCronograma) {
        setCronogramas(prev => prev.map(c => c.id === editingCronograma.id ? novoCronograma : c))
      } else {
        setCronogramas(prev => [...prev, novoCronograma])
      }

      // Reset form
      setFormData({
        nome: '',
        projeto: '',
        cliente: '',
        dataInicio: '',
        dataFim: '',
        descricao: ''
      })
      setTarefas([])
      setEditingCronograma(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Erro ao salvar cronograma:', error)
    }
  }

  const handleEdit = (cronograma: Cronograma) => {
    setFormData({
      nome: cronograma.nome,
      projeto: cronograma.projeto,
      cliente: cronograma.cliente,
      dataInicio: cronograma.dataInicio,
      dataFim: cronograma.dataFim,
      descricao: cronograma.descricao
    })
    setTarefas([...cronograma.tarefas])
    setEditingCronograma(cronograma)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cronograma?')) {
      setCronogramas(prev => prev.filter(c => c.id !== id))
    }
  }

  const handleViewDetails = (cronograma: Cronograma) => {
    setSelectedCronograma(cronograma)
    setIsDetailDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando cronogramas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cronogramas</h2>
          <p className="text-muted-foreground">
            Gerencie cronogramas e acompanhe o progresso dos projetos
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCronograma(null)
              setFormData({
                nome: '',
                projeto: '',
                cliente: '',
                dataInicio: '',
                dataFim: '',
                descricao: ''
              })
              setTarefas([])
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cronograma
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCronograma ? 'Editar Cronograma' : 'Novo Cronograma'}
              </DialogTitle>
              <DialogDescription>
                {editingCronograma ? 'Edite as informações do cronograma' : 'Crie um novo cronograma para seu projeto'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Cronograma *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projeto">Projeto *</Label>
                  <Input
                    id="projeto"
                    value={formData.projeto}
                    onChange={(e) => setFormData(prev => ({ ...prev, projeto: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início *</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Término *</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Tarefas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tarefas do Cronograma</h3>
                
                {/* Adicionar Tarefa */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Adicionar Tarefa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da Tarefa</Label>
                        <Input
                          value={novaTarefa.nome}
                          onChange={(e) => setNovaTarefa(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: Fundação"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Responsável</Label>
                        <Input
                          value={novaTarefa.responsavel}
                          onChange={(e) => setNovaTarefa(prev => ({ ...prev, responsavel: e.target.value }))}
                          placeholder="Ex: Equipe de Fundação"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={novaTarefa.descricao}
                        onChange={(e) => setNovaTarefa(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Descrição detalhada da tarefa"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Data de Início</Label>
                        <Input
                          type="date"
                          value={novaTarefa.dataInicio}
                          onChange={(e) => setNovaTarefa(prev => ({ ...prev, dataInicio: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Data de Término</Label>
                        <Input
                          type="date"
                          value={novaTarefa.dataFim}
                          onChange={(e) => setNovaTarefa(prev => ({ ...prev, dataFim: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Prioridade</Label>
                        <Select 
                          value={novaTarefa.prioridade} 
                          onValueChange={(value: 'Baixa' | 'Média' | 'Alta' | 'Crítica') => 
                            setNovaTarefa(prev => ({ ...prev, prioridade: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Crítica">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="button" onClick={adicionarTarefa} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Tarefa
                    </Button>
                  </CardContent>
                </Card>

                {/* Lista de Tarefas */}
                {tarefas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Tarefas Adicionadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {tarefas.map((tarefa) => (
                          <div key={tarefa.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{tarefa.nome}</span>
                                <Badge variant="outline" className={getPriorityColor(tarefa.prioridade)}>
                                  {tarefa.prioridade}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {tarefa.responsavel} • {formatDate(tarefa.dataInicio)} - {formatDate(tarefa.dataFim)}
                              </div>
                              {tarefa.descricao && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {tarefa.descricao}
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerTarefa(tarefa.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCronograma ? 'Salvar Alterações' : 'Criar Cronograma'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, projeto ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Planejamento">Planejamento</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{cronogramas.length}</div>
            <p className="text-sm text-muted-foreground">Total de Cronogramas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {cronogramas.filter(c => c.status === 'Em Andamento').length}
            </div>
            <p className="text-sm text-muted-foreground">Em Andamento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {cronogramas.filter(c => c.status === 'Concluído').length}
            </div>
            <p className="text-sm text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {cronogramas.filter(c => c.status === 'Atrasado').length}
            </div>
            <p className="text-sm text-muted-foreground">Atrasados</p>
          </CardContent>
        </Card>
      </div>

      {/* Cronogramas List */}
      <div className="grid gap-4">
        {filteredCronogramas.map((cronograma) => (
          <Card key={cronograma.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{cronograma.nome}</h3>
                    <Badge className={getStatusColor(cronograma.status)}>
                      {cronograma.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Cliente: {cronograma.cliente}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Início: {formatDate(cronograma.dataInicio)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Término: {formatDate(cronograma.dataFim)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso Geral</span>
                      <span className="font-medium">{cronograma.progresso}%</span>
                    </div>
                    <Progress value={cronograma.progresso} className="h-2" />
                  </div>
                  
                  <p className="text-sm">{cronograma.descricao}</p>
                  
                  <div className="text-sm text-muted-foreground">
                    {cronograma.tarefas.length} tarefa(s) • 
                    {cronograma.tarefas.filter(t => t.status === 'Concluída').length} concluída(s)
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(cronograma)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(cronograma)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(cronograma.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCronogramas.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Nenhum cronograma encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'todos'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro cronograma'
                  }
                </p>
                {!searchTerm && statusFilter === 'todos' && (
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Cronograma
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cronograma</DialogTitle>
            <DialogDescription>
              Visualize todas as tarefas e o progresso do cronograma
            </DialogDescription>
          </DialogHeader>
          
          {selectedCronograma && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Projeto</h3>
                  <p>{selectedCronograma.projeto}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Cliente</h3>
                  <p>{selectedCronograma.cliente}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Data de Início</h3>
                  <p>{formatDate(selectedCronograma.dataInicio)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Data de Término</h3>
                  <p>{formatDate(selectedCronograma.dataFim)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Progresso Geral</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progresso</span>
                    <span className="font-medium">{selectedCronograma.progresso}%</span>
                  </div>
                  <Progress value={selectedCronograma.progresso} className="h-3" />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Tarefas ({selectedCronograma.tarefas.length})</h3>
                <div className="space-y-3">
                  {selectedCronograma.tarefas.map((tarefa) => (
                    <div key={tarefa.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tarefa.status)}
                          <h4 className="font-medium">{tarefa.nome}</h4>
                          <Badge className={getTaskStatusColor(tarefa.status)}>
                            {tarefa.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(tarefa.prioridade)}>
                            {tarefa.prioridade}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">{tarefa.progresso}%</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{tarefa.descricao}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-2">
                        <div>Responsável: {tarefa.responsavel}</div>
                        <div>Início: {formatDate(tarefa.dataInicio)}</div>
                        <div>Término: {formatDate(tarefa.dataFim)}</div>
                      </div>
                      
                      <Progress value={tarefa.progresso} className="h-2" />
                    </div>
                  ))}
                  
                  {selectedCronograma.tarefas.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma tarefa adicionada ainda
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
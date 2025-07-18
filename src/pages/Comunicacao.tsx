import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Plus, 
  Search, 
  Filter,
  Send,
  Phone,
  Video,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Paperclip,
  Star,
  Archive
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { blink } from '@/blink/client'

interface Mensagem {
  id: string
  remetente: string
  destinatario: string
  assunto: string
  conteudo: string
  tipo: 'Email' | 'WhatsApp' | 'Telefone' | 'Reunião' | 'Nota'
  status: 'Enviado' | 'Lido' | 'Respondido' | 'Pendente'
  dataEnvio: string
  projeto?: string
  cliente: string
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente'
  anexos?: string[]
  importante: boolean
}

interface Reuniao {
  id: string
  titulo: string
  cliente: string
  projeto?: string
  dataHora: string
  duracao: number
  local: string
  tipo: 'Presencial' | 'Online' | 'Telefone'
  status: 'Agendada' | 'Confirmada' | 'Realizada' | 'Cancelada' | 'Reagendada'
  participantes: string[]
  observacoes: string
  linkReuniao?: string
}

export function Comunicacao() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('todos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('mensagens')

  // Form states
  const [formMensagem, setFormMensagem] = useState({
    destinatario: '',
    cliente: '',
    projeto: '',
    assunto: '',
    conteudo: '',
    tipo: 'Email' as 'Email' | 'WhatsApp' | 'Telefone' | 'Reunião' | 'Nota',
    prioridade: 'Média' as 'Baixa' | 'Média' | 'Alta' | 'Urgente'
  })

  const [formReuniao, setFormReuniao] = useState({
    titulo: '',
    cliente: '',
    projeto: '',
    dataHora: '',
    duracao: 60,
    local: '',
    tipo: 'Presencial' as 'Presencial' | 'Online' | 'Telefone',
    participantes: '',
    observacoes: '',
    linkReuniao: ''
  })

  useEffect(() => {
    loadComunicacao()
  }, [])

  const loadComunicacao = async () => {
    try {
      // Dados simulados - depois conectaremos com o banco
      const mensagensData: Mensagem[] = [
        {
          id: '1',
          remetente: 'Você',
          destinatario: 'joao.silva@email.com',
          assunto: 'Aprovação do projeto Casa Alphaville',
          conteudo: 'Olá João, gostaria de confirmar se você aprovou o projeto da casa moderna. Aguardo seu retorno.',
          tipo: 'Email',
          status: 'Respondido',
          dataEnvio: '2024-07-15T10:30:00',
          projeto: 'Casa Moderna Alphaville',
          cliente: 'João Silva',
          prioridade: 'Alta',
          importante: true
        },
        {
          id: '2',
          remetente: 'maria.santos@email.com',
          destinatario: 'Você',
          assunto: 'Dúvidas sobre reforma',
          conteudo: 'Oi! Tenho algumas dúvidas sobre os materiais que serão utilizados na reforma. Podemos conversar?',
          tipo: 'Email',
          status: 'Pendente',
          dataEnvio: '2024-07-16T14:20:00',
          projeto: 'Reforma Apartamento Centro',
          cliente: 'Maria Santos',
          prioridade: 'Média',
          importante: false
        },
        {
          id: '3',
          remetente: 'Você',
          destinatario: 'Carlos Oliveira',
          assunto: 'Ligação sobre orçamento',
          conteudo: 'Ligação realizada para esclarecer dúvidas sobre o orçamento do escritório comercial. Cliente interessado em prosseguir.',
          tipo: 'Telefone',
          status: 'Enviado',
          dataEnvio: '2024-07-16T16:45:00',
          projeto: 'Escritório Comercial',
          cliente: 'Carlos Oliveira',
          prioridade: 'Média',
          importante: false
        },
        {
          id: '4',
          remetente: 'Você',
          destinatario: 'Ana Costa',
          assunto: 'Primeira reunião - Casa de Campo',
          conteudo: 'Reunião inicial para discussão do projeto da casa de campo. Cliente apresentou suas ideias e preferências.',
          tipo: 'Reunião',
          status: 'Enviado',
          dataEnvio: '2024-07-14T09:00:00',
          cliente: 'Ana Costa',
          prioridade: 'Alta',
          importante: true
        }
      ]

      const reunioesData: Reuniao[] = [
        {
          id: '1',
          titulo: 'Apresentação do Projeto Final',
          cliente: 'João Silva',
          projeto: 'Casa Moderna Alphaville',
          dataHora: '2024-07-20T14:00:00',
          duracao: 90,
          local: 'Escritório - Sala de Reuniões',
          tipo: 'Presencial',
          status: 'Confirmada',
          participantes: ['João Silva', 'Arquiteto Responsável', 'Engenheiro'],
          observacoes: 'Trazer plantas impressas e maquete 3D',
          linkReuniao: ''
        },
        {
          id: '2',
          titulo: 'Reunião de Acompanhamento - Reforma',
          cliente: 'Maria Santos',
          projeto: 'Reforma Apartamento Centro',
          dataHora: '2024-07-18T10:30:00',
          duracao: 60,
          local: 'Google Meet',
          tipo: 'Online',
          status: 'Agendada',
          participantes: ['Maria Santos', 'Arquiteto', 'Mestre de Obras'],
          observacoes: 'Revisar cronograma e possíveis ajustes',
          linkReuniao: 'https://meet.google.com/abc-defg-hij'
        },
        {
          id: '3',
          titulo: 'Visita ao Terreno',
          cliente: 'Ana Costa',
          projeto: 'Casa de Campo',
          dataHora: '2024-07-22T08:00:00',
          duracao: 120,
          local: 'Campos do Jordão - Terreno do Cliente',
          tipo: 'Presencial',
          status: 'Agendada',
          participantes: ['Ana Costa', 'Arquiteto', 'Topógrafo'],
          observacoes: 'Levar equipamentos de medição e câmera',
          linkReuniao: ''
        }
      ]
      
      setMensagens(mensagensData)
      setReunioes(reunioesData)
    } catch (error) {
      console.error('Erro ao carregar comunicações:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enviado':
        return 'bg-blue-100 text-blue-800'
      case 'Lido':
        return 'bg-yellow-100 text-yellow-800'
      case 'Respondido':
        return 'bg-green-100 text-green-800'
      case 'Pendente':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'Agendada':
        return 'bg-blue-100 text-blue-800'
      case 'Confirmada':
        return 'bg-green-100 text-green-800'
      case 'Realizada':
        return 'bg-gray-100 text-gray-800'
      case 'Cancelada':
        return 'bg-red-100 text-red-800'
      case 'Reagendada':
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
      case 'Urgente':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Email':
        return <Mail className="h-4 w-4" />
      case 'WhatsApp':
        return <MessageSquare className="h-4 w-4" />
      case 'Telefone':
        return <Phone className="h-4 w-4" />
      case 'Reunião':
        return <Video className="h-4 w-4" />
      case 'Nota':
        return <Edit className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const filteredMensagens = mensagens.filter(mensagem => {
    const matchesSearch = mensagem.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mensagem.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mensagem.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === 'todos' || mensagem.tipo === tipoFilter
    const matchesStatus = statusFilter === 'todos' || mensagem.status === statusFilter
    
    return matchesSearch && matchesTipo && matchesStatus
  })

  const filteredReunioes = reunioes.filter(reuniao => {
    const matchesSearch = reuniao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reuniao.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || reuniao.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleSubmitMensagem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const novaMensagem: Mensagem = {
        id: Date.now().toString(),
        remetente: 'Você',
        ...formMensagem,
        status: 'Enviado',
        dataEnvio: new Date().toISOString(),
        importante: false
      }

      setMensagens(prev => [novaMensagem, ...prev])

      // Reset form
      setFormMensagem({
        destinatario: '',
        cliente: '',
        projeto: '',
        assunto: '',
        conteudo: '',
        tipo: 'Email',
        prioridade: 'Média'
      })
      
      setIsMessageDialogOpen(false)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const handleSubmitReuniao = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const novaReuniao: Reuniao = {
        id: Date.now().toString(),
        ...formReuniao,
        status: 'Agendada',
        participantes: formReuniao.participantes.split(',').map(p => p.trim()).filter(p => p)
      }

      setReunioes(prev => [novaReuniao, ...prev])

      // Reset form
      setFormReuniao({
        titulo: '',
        cliente: '',
        projeto: '',
        dataHora: '',
        duracao: 60,
        local: '',
        tipo: 'Presencial',
        participantes: '',
        observacoes: '',
        linkReuniao: ''
      })
      
      setIsMeetingDialogOpen(false)
    } catch (error) {
      console.error('Erro ao agendar reunião:', error)
    }
  }

  const toggleImportante = (id: string) => {
    setMensagens(prev => prev.map(msg => 
      msg.id === id ? { ...msg, importante: !msg.importante } : msg
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando comunicações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comunicação</h2>
          <p className="text-muted-foreground">
            Gerencie todas as comunicações com seus clientes
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Nova Mensagem
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Mensagem</DialogTitle>
                <DialogDescription>
                  Envie uma nova mensagem ou registre uma comunicação
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitMensagem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Comunicação *</Label>
                    <Select 
                      value={formMensagem.tipo} 
                      onValueChange={(value: 'Email' | 'WhatsApp' | 'Telefone' | 'Reunião' | 'Nota') => 
                        setFormMensagem(prev => ({ ...prev, tipo: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Telefone">Telefone</SelectItem>
                        <SelectItem value="Reunião">Reunião</SelectItem>
                        <SelectItem value="Nota">Nota Interna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select 
                      value={formMensagem.prioridade} 
                      onValueChange={(value: 'Baixa' | 'Média' | 'Alta' | 'Urgente') => 
                        setFormMensagem(prev => ({ ...prev, prioridade: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cliente">Cliente *</Label>
                    <Input
                      id="cliente"
                      value={formMensagem.cliente}
                      onChange={(e) => setFormMensagem(prev => ({ ...prev, cliente: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destinatario">Destinatário *</Label>
                    <Input
                      id="destinatario"
                      value={formMensagem.destinatario}
                      onChange={(e) => setFormMensagem(prev => ({ ...prev, destinatario: e.target.value }))}
                      placeholder="email@exemplo.com ou nome"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projeto">Projeto</Label>
                  <Input
                    id="projeto"
                    value={formMensagem.projeto}
                    onChange={(e) => setFormMensagem(prev => ({ ...prev, projeto: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto *</Label>
                  <Input
                    id="assunto"
                    value={formMensagem.assunto}
                    onChange={(e) => setFormMensagem(prev => ({ ...prev, assunto: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conteudo">Conteúdo *</Label>
                  <Textarea
                    id="conteudo"
                    value={formMensagem.conteudo}
                    onChange={(e) => setFormMensagem(prev => ({ ...prev, conteudo: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Reunião
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agendar Reunião</DialogTitle>
                <DialogDescription>
                  Agende uma nova reunião com seu cliente
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitReuniao} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Reunião *</Label>
                  <Input
                    id="titulo"
                    value={formReuniao.titulo}
                    onChange={(e) => setFormReuniao(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clienteReuniao">Cliente *</Label>
                    <Input
                      id="clienteReuniao"
                      value={formReuniao.cliente}
                      onChange={(e) => setFormReuniao(prev => ({ ...prev, cliente: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projetoReuniao">Projeto</Label>
                    <Input
                      id="projetoReuniao"
                      value={formReuniao.projeto}
                      onChange={(e) => setFormReuniao(prev => ({ ...prev, projeto: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataHora">Data e Hora *</Label>
                    <Input
                      id="dataHora"
                      type="datetime-local"
                      value={formReuniao.dataHora}
                      onChange={(e) => setFormReuniao(prev => ({ ...prev, dataHora: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (min)</Label>
                    <Input
                      id="duracao"
                      type="number"
                      value={formReuniao.duracao}
                      onChange={(e) => setFormReuniao(prev => ({ ...prev, duracao: Number(e.target.value) }))}
                      min="15"
                      step="15"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tipoReuniao">Tipo</Label>
                    <Select 
                      value={formReuniao.tipo} 
                      onValueChange={(value: 'Presencial' | 'Online' | 'Telefone') => 
                        setFormReuniao(prev => ({ ...prev, tipo: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Telefone">Telefone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="local">Local *</Label>
                  <Input
                    id="local"
                    value={formReuniao.local}
                    onChange={(e) => setFormReuniao(prev => ({ ...prev, local: e.target.value }))}
                    placeholder="Endereço ou link da reunião"
                    required
                  />
                </div>

                {formReuniao.tipo === 'Online' && (
                  <div className="space-y-2">
                    <Label htmlFor="linkReuniao">Link da Reunião</Label>
                    <Input
                      id="linkReuniao"
                      value={formReuniao.linkReuniao}
                      onChange={(e) => setFormReuniao(prev => ({ ...prev, linkReuniao: e.target.value }))}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="participantes">Participantes</Label>
                  <Input
                    id="participantes"
                    value={formReuniao.participantes}
                    onChange={(e) => setFormReuniao(prev => ({ ...prev, participantes: e.target.value }))}
                    placeholder="Separe os nomes por vírgula"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoesReuniao">Observações</Label>
                  <Textarea
                    id="observacoesReuniao"
                    value={formReuniao.observacoes}
                    onChange={(e) => setFormReuniao(prev => ({ ...prev, observacoes: e.target.value }))}
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsMeetingDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por assunto, cliente ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              {activeTab === 'mensagens' && (
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Telefone">Telefone</SelectItem>
                    <SelectItem value="Reunião">Reunião</SelectItem>
                    <SelectItem value="Nota">Nota</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {activeTab === 'mensagens' ? (
                    <>
                      <SelectItem value="Enviado">Enviado</SelectItem>
                      <SelectItem value="Lido">Lido</SelectItem>
                      <SelectItem value="Respondido">Respondido</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Agendada">Agendada</SelectItem>
                      <SelectItem value="Confirmada">Confirmada</SelectItem>
                      <SelectItem value="Realizada">Realizada</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mensagens">
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensagens ({mensagens.length})
          </TabsTrigger>
          <TabsTrigger value="reunioes">
            <Calendar className="mr-2 h-4 w-4" />
            Reuniões ({reunioes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mensagens" className="space-y-4">
          {/* Stats Mensagens */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{mensagens.length}</div>
                <p className="text-sm text-muted-foreground">Total de Mensagens</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {mensagens.filter(m => m.status === 'Pendente').length}
                </div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {mensagens.filter(m => m.status === 'Respondido').length}
                </div>
                <p className="text-sm text-muted-foreground">Respondidas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {mensagens.filter(m => m.importante).length}
                </div>
                <p className="text-sm text-muted-foreground">Importantes</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Mensagens */}
          <div className="space-y-3">
            {filteredMensagens.map((mensagem) => {
              const dateTime = formatDateTime(mensagem.dataEnvio)
              return (
                <Card key={mensagem.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(mensagem.remetente === 'Você' ? mensagem.cliente : mensagem.remetente)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getTipoIcon(mensagem.tipo)}
                            <h3 className="font-medium">{mensagem.assunto}</h3>
                            <Badge className={getStatusColor(mensagem.status)}>
                              {mensagem.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(mensagem.prioridade)}>
                              {mensagem.prioridade}
                            </Badge>
                            {mensagem.importante && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{mensagem.remetente}</span> → {mensagem.destinatario}
                            {mensagem.projeto && (
                              <span className="ml-2">• Projeto: {mensagem.projeto}</span>
                            )}
                          </div>
                          
                          <p className="text-sm line-clamp-2">{mensagem.conteudo}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {mensagem.cliente}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {dateTime.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {dateTime.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleImportante(mensagem.id)}
                        >
                          <Star className={`h-4 w-4 ${mensagem.importante ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Responder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Arquivar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
            {filteredMensagens.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Nenhuma mensagem encontrada</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || tipoFilter !== 'todos' || statusFilter !== 'todos'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Comece enviando sua primeira mensagem'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reunioes" className="space-y-4">
          {/* Stats Reuniões */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{reunioes.length}</div>
                <p className="text-sm text-muted-foreground">Total de Reuniões</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {reunioes.filter(r => r.status === 'Agendada').length}
                </div>
                <p className="text-sm text-muted-foreground">Agendadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {reunioes.filter(r => r.status === 'Confirmada').length}
                </div>
                <p className="text-sm text-muted-foreground">Confirmadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-600">
                  {reunioes.filter(r => r.status === 'Realizada').length}
                </div>
                <p className="text-sm text-muted-foreground">Realizadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Reuniões */}
          <div className="space-y-3">
            {filteredReunioes.map((reuniao) => {
              const dateTime = formatDateTime(reuniao.dataHora)
              return (
                <Card key={reuniao.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {reuniao.tipo === 'Online' ? (
                            <Video className="h-5 w-5 text-primary" />
                          ) : reuniao.tipo === 'Telefone' ? (
                            <Phone className="h-5 w-5 text-primary" />
                          ) : (
                            <Calendar className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{reuniao.titulo}</h3>
                            <Badge className={getMeetingStatusColor(reuniao.status)}>
                              {reuniao.status}
                            </Badge>
                            <Badge variant="outline">
                              {reuniao.tipo}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Cliente: {reuniao.cliente}
                            </div>
                            {reuniao.projeto && (
                              <div>Projeto: {reuniao.projeto}</div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {dateTime.date} às {dateTime.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {reuniao.duracao} minutos
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">Local:</span> {reuniao.local}
                          </div>
                          
                          {reuniao.linkReuniao && (
                            <div className="text-sm">
                              <span className="font-medium">Link:</span>{' '}
                              <a href={reuniao.linkReuniao} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Acessar reunião
                              </a>
                            </div>
                          )}
                          
                          {reuniao.participantes.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium">Participantes:</span> {reuniao.participantes.join(', ')}
                            </div>
                          )}
                          
                          {reuniao.observacoes && (
                            <p className="text-sm text-muted-foreground">{reuniao.observacoes}</p>
                          )}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {reuniao.linkReuniao && (
                            <DropdownMenuItem>
                              <Video className="mr-2 h-4 w-4" />
                              Entrar na Reunião
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            
            {filteredReunioes.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Nenhuma reunião encontrada</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'todos'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Comece agendando sua primeira reunião'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
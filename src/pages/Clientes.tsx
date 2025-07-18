import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin,
  Building,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { blink } from '@/blink/client'

interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  empresa?: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  status: 'Ativo' | 'Inativo' | 'Lead' | 'Prospect'
  tipo: 'Pessoa Física' | 'Pessoa Jurídica'
  dataContato: string
  observacoes?: string
  projetosAtivos: number
  valorTotal: number
}

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    tipo: 'Pessoa Física' as 'Pessoa Física' | 'Pessoa Jurídica',
    status: 'Lead' as 'Ativo' | 'Inativo' | 'Lead' | 'Prospect',
    observacoes: ''
  })

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      // Simular dados por enquanto - depois conectaremos com o banco
      const mockClientes: Cliente[] = [
        {
          id: '1',
          nome: 'João Silva',
          email: 'joao.silva@email.com',
          telefone: '(11) 99999-9999',
          empresa: 'Silva Construtora',
          endereco: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          status: 'Ativo',
          tipo: 'Pessoa Jurídica',
          dataContato: '2024-01-15',
          observacoes: 'Cliente interessado em projetos residenciais de alto padrão',
          projetosAtivos: 2,
          valorTotal: 85000
        },
        {
          id: '2',
          nome: 'Maria Santos',
          email: 'maria.santos@email.com',
          telefone: '(11) 88888-8888',
          endereco: 'Av. Paulista, 456',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
          status: 'Ativo',
          tipo: 'Pessoa Física',
          dataContato: '2024-02-10',
          observacoes: 'Reforma de apartamento no centro',
          projetosAtivos: 1,
          valorTotal: 28000
        },
        {
          id: '3',
          nome: 'Carlos Oliveira',
          email: 'carlos.oliveira@email.com',
          telefone: '(11) 77777-7777',
          empresa: 'Oliveira & Associados',
          endereco: 'Rua Augusta, 789',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01305-000',
          status: 'Lead',
          tipo: 'Pessoa Jurídica',
          dataContato: '2024-03-05',
          observacoes: 'Interessado em projeto de escritório comercial',
          projetosAtivos: 0,
          valorTotal: 0
        },
        {
          id: '4',
          nome: 'Ana Costa',
          email: 'ana.costa@email.com',
          telefone: '(11) 66666-6666',
          endereco: 'Rua Oscar Freire, 321',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01426-001',
          status: 'Prospect',
          tipo: 'Pessoa Física',
          dataContato: '2024-03-12',
          observacoes: 'Casa de campo em Campos do Jordão',
          projetosAtivos: 0,
          valorTotal: 0
        }
      ]
      
      setClientes(mockClientes)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cliente.empresa && cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'todos' || cliente.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Inativo':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Lead':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Prospect':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const novoCliente: Cliente = {
        id: editingCliente ? editingCliente.id : Date.now().toString(),
        ...formData,
        dataContato: editingCliente ? editingCliente.dataContato : new Date().toISOString().split('T')[0],
        projetosAtivos: editingCliente ? editingCliente.projetosAtivos : 0,
        valorTotal: editingCliente ? editingCliente.valorTotal : 0
      }

      if (editingCliente) {
        setClientes(prev => prev.map(c => c.id === editingCliente.id ? novoCliente : c))
      } else {
        setClientes(prev => [...prev, novoCliente])
      }

      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        tipo: 'Pessoa Física',
        status: 'Lead',
        observacoes: ''
      })
      
      setEditingCliente(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      empresa: cliente.empresa || '',
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      tipo: cliente.tipo,
      status: cliente.status,
      observacoes: cliente.observacoes || ''
    })
    setEditingCliente(cliente)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClientes(prev => prev.filter(c => c.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes e prospects
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCliente(null)
              setFormData({
                nome: '',
                email: '',
                telefone: '',
                empresa: '',
                endereco: '',
                cidade: '',
                estado: '',
                cep: '',
                tipo: 'Pessoa Física',
                status: 'Lead',
                observacoes: ''
              })
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
              <DialogDescription>
                {editingCliente ? 'Edite as informações do cliente' : 'Adicione um novo cliente ao sistema'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData(prev => ({ ...prev, empresa: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value: 'Pessoa Física' | 'Pessoa Jurídica') => 
                    setFormData(prev => ({ ...prev, tipo: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
                      <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'Ativo' | 'Inativo' | 'Lead' | 'Prospect') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCliente ? 'Salvar Alterações' : 'Criar Cliente'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{clientes.length}</div>
            <p className="text-sm text-muted-foreground">Total de Clientes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {clientes.filter(c => c.status === 'Ativo').length}
            </div>
            <p className="text-sm text-muted-foreground">Clientes Ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {clientes.filter(c => c.status === 'Lead').length}
            </div>
            <p className="text-sm text-muted-foreground">Leads</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {clientes.filter(c => c.status === 'Prospect').length}
            </div>
            <p className="text-sm text-muted-foreground">Prospects</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClientes.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(cliente.nome)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{cliente.nome}</h3>
                      <Badge className={getStatusColor(cliente.status)}>
                        {cliente.status}
                      </Badge>
                      {cliente.tipo === 'Pessoa Jurídica' && (
                        <Badge variant="outline" className="text-xs">
                          <Building className="mr-1 h-3 w-3" />
                          PJ
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {cliente.telefone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cliente.cidade}, {cliente.estado}
                      </div>
                    </div>
                    
                    {cliente.empresa && (
                      <p className="text-sm text-muted-foreground">
                        <Building className="inline h-3 w-3 mr-1" />
                        {cliente.empresa}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {cliente.projetosAtivos} projeto(s)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(cliente.valorTotal)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Desde {formatDate(cliente.dataContato)}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(cliente)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(cliente.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {filteredClientes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
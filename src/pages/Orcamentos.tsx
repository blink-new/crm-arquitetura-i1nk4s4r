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
  DollarSign,
  User,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  FileText,
  Clock
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
import { blink } from '@/blink/client'

interface ItemOrcamento {
  id: string
  descricao: string
  quantidade: number
  unidade: string
  valorUnitario: number
  valorTotal: number
  categoria: 'Material' | 'Mão de Obra' | 'Equipamento' | 'Outros'
}

interface Orcamento {
  id: string
  numero: string
  cliente: string
  projeto: string
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Rejeitado' | 'Expirado'
  dataEmissao: string
  dataValidade: string
  valorTotal: number
  descricao: string
  observacoes: string
  itens: ItemOrcamento[]
}

export function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    cliente: '',
    projeto: '',
    descricao: '',
    observacoes: '',
    dataValidade: ''
  })

  const [itens, setItens] = useState<ItemOrcamento[]>([])
  const [novoItem, setNovoItem] = useState({
    descricao: '',
    quantidade: 1,
    unidade: 'un',
    valorUnitario: 0,
    categoria: 'Material' as 'Material' | 'Mão de Obra' | 'Equipamento' | 'Outros'
  })

  useEffect(() => {
    loadOrcamentos()
  }, [])

  const loadOrcamentos = async () => {
    try {
      // Dados simulados - depois conectaremos com o banco
      const orcamentosData: Orcamento[] = [
        {
          id: '1',
          numero: 'ORC-2024-001',
          cliente: 'João Silva',
          projeto: 'Casa Moderna Alphaville',
          status: 'Enviado',
          dataEmissao: '2024-07-01',
          dataValidade: '2024-07-31',
          valorTotal: 450000,
          descricao: 'Orçamento para construção de casa moderna com 3 suítes',
          observacoes: 'Valores válidos por 30 dias. Materiais de primeira linha.',
          itens: [
            {
              id: '1',
              descricao: 'Fundação e estrutura',
              quantidade: 1,
              unidade: 'vb',
              valorUnitario: 120000,
              valorTotal: 120000,
              categoria: 'Mão de Obra'
            },
            {
              id: '2',
              descricao: 'Materiais de construção',
              quantidade: 1,
              unidade: 'vb',
              valorUnitario: 180000,
              valorTotal: 180000,
              categoria: 'Material'
            },
            {
              id: '3',
              descricao: 'Acabamentos',
              quantidade: 1,
              unidade: 'vb',
              valorUnitario: 150000,
              valorTotal: 150000,
              categoria: 'Material'
            }
          ]
        },
        {
          id: '2',
          numero: 'ORC-2024-002',
          cliente: 'Maria Santos',
          projeto: 'Reforma Apartamento Centro',
          status: 'Aprovado',
          dataEmissao: '2024-06-15',
          dataValidade: '2024-07-15',
          valorTotal: 280000,
          descricao: 'Orçamento para reforma completa de apartamento',
          observacoes: 'Inclui demolição e reconstrução de paredes.',
          itens: [
            {
              id: '1',
              descricao: 'Demolição',
              quantidade: 120,
              unidade: 'm²',
              valorUnitario: 50,
              valorTotal: 6000,
              categoria: 'Mão de Obra'
            },
            {
              id: '2',
              descricao: 'Materiais hidráulicos',
              quantidade: 1,
              unidade: 'vb',
              valorUnitario: 45000,
              valorTotal: 45000,
              categoria: 'Material'
            }
          ]
        },
        {
          id: '3',
          numero: 'ORC-2024-003',
          cliente: 'Empresa ABC',
          projeto: 'Escritório Comercial',
          status: 'Rascunho',
          dataEmissao: '2024-07-10',
          dataValidade: '2024-08-10',
          valorTotal: 650000,
          descricao: 'Orçamento para projeto de escritório corporativo',
          observacoes: 'Aguardando definição de alguns materiais.',
          itens: []
        }
      ]
      
      setOrcamentos(orcamentosData)
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rascunho':
        return 'bg-gray-100 text-gray-800'
      case 'Enviado':
        return 'bg-blue-100 text-blue-800'
      case 'Aprovado':
        return 'bg-green-100 text-green-800'
      case 'Rejeitado':
        return 'bg-red-100 text-red-800'
      case 'Expirado':
        return 'bg-orange-100 text-orange-800'
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

  const filteredOrcamentos = orcamentos.filter(orcamento => {
    const matchesSearch = orcamento.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orcamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orcamento.projeto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || orcamento.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const adicionarItem = () => {
    if (!novoItem.descricao) return

    const item: ItemOrcamento = {
      id: Date.now().toString(),
      ...novoItem,
      valorTotal: novoItem.quantidade * novoItem.valorUnitario
    }

    setItens(prev => [...prev, item])
    setNovoItem({
      descricao: '',
      quantidade: 1,
      unidade: 'un',
      valorUnitario: 0,
      categoria: 'Material'
    })
  }

  const removerItem = (id: string) => {
    setItens(prev => prev.filter(item => item.id !== id))
  }

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + item.valorTotal, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const novoOrcamento: Orcamento = {
        id: editingOrcamento ? editingOrcamento.id : Date.now().toString(),
        numero: editingOrcamento ? editingOrcamento.numero : `ORC-2024-${String(orcamentos.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'Rascunho',
        dataEmissao: editingOrcamento ? editingOrcamento.dataEmissao : new Date().toISOString().split('T')[0],
        valorTotal: calcularTotal(),
        itens: [...itens]
      }

      if (editingOrcamento) {
        setOrcamentos(prev => prev.map(o => o.id === editingOrcamento.id ? novoOrcamento : o))
      } else {
        setOrcamentos(prev => [...prev, novoOrcamento])
      }

      // Reset form
      setFormData({
        cliente: '',
        projeto: '',
        descricao: '',
        observacoes: '',
        dataValidade: ''
      })
      setItens([])
      setEditingOrcamento(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error)
    }
  }

  const handleEdit = (orcamento: Orcamento) => {
    setFormData({
      cliente: orcamento.cliente,
      projeto: orcamento.projeto,
      descricao: orcamento.descricao,
      observacoes: orcamento.observacoes,
      dataValidade: orcamento.dataValidade
    })
    setItens([...orcamento.itens])
    setEditingOrcamento(orcamento)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      setOrcamentos(prev => prev.filter(o => o.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando orçamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orçamentos</h2>
          <p className="text-muted-foreground">
            Gerencie orçamentos e propostas comerciais
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingOrcamento(null)
              setFormData({
                cliente: '',
                projeto: '',
                descricao: '',
                observacoes: '',
                dataValidade: ''
              })
              setItens([])
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
              </DialogTitle>
              <DialogDescription>
                {editingOrcamento ? 'Edite as informações do orçamento' : 'Crie um novo orçamento para seu cliente'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Input
                    id="cliente"
                    value={formData.cliente}
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente: e.target.value }))}
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
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  required
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataValidade">Data de Validade *</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={formData.dataValidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataValidade: e.target.value }))}
                  required
                />
              </div>

              {/* Itens do Orçamento */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Itens do Orçamento</h3>
                
                {/* Adicionar Item */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Adicionar Item</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Input
                          value={novoItem.descricao}
                          onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                          placeholder="Ex: Cimento Portland"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select 
                          value={novoItem.categoria} 
                          onValueChange={(value: 'Material' | 'Mão de Obra' | 'Equipamento' | 'Outros') => 
                            setNovoItem(prev => ({ ...prev, categoria: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Material">Material</SelectItem>
                            <SelectItem value="Mão de Obra">Mão de Obra</SelectItem>
                            <SelectItem value="Equipamento">Equipamento</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          value={novoItem.quantidade}
                          onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Select 
                          value={novoItem.unidade} 
                          onValueChange={(value) => setNovoItem(prev => ({ ...prev, unidade: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="un">Unidade</SelectItem>
                            <SelectItem value="m²">m²</SelectItem>
                            <SelectItem value="m³">m³</SelectItem>
                            <SelectItem value="m">Metro</SelectItem>
                            <SelectItem value="kg">Quilograma</SelectItem>
                            <SelectItem value="vb">Verba</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Valor Unitário</Label>
                        <Input
                          type="number"
                          value={novoItem.valorUnitario}
                          onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: Number(e.target.value) }))}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={formatCurrency(novoItem.quantidade * novoItem.valorUnitario)}
                          disabled
                        />
                      </div>
                    </div>

                    <Button type="button" onClick={adicionarItem} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Item
                    </Button>
                  </CardContent>
                </Card>

                {/* Lista de Itens */}
                {itens.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Itens Adicionados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {itens.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.descricao}</span>
                                <Badge variant="outline">{item.categoria}</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.quantidade} {item.unidade} × {formatCurrency(item.valorUnitario)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{formatCurrency(item.valorTotal)}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removerItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center pt-4 border-t font-bold">
                          <span>Total Geral:</span>
                          <span className="text-lg">{formatCurrency(calcularTotal())}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                  placeholder="Condições de pagamento, prazos, etc."
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOrcamento ? 'Salvar Alterações' : 'Criar Orçamento'}
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
                placeholder="Buscar por número, cliente ou projeto..."
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
                <SelectItem value="Rascunho">Rascunho</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                <SelectItem value="Expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{orcamentos.length}</div>
            <p className="text-sm text-muted-foreground">Total de Orçamentos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {orcamentos.filter(o => o.status === 'Enviado').length}
            </div>
            <p className="text-sm text-muted-foreground">Aguardando Resposta</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {orcamentos.filter(o => o.status === 'Aprovado').length}
            </div>
            <p className="text-sm text-muted-foreground">Aprovados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatCurrency(orcamentos.filter(o => o.status === 'Aprovado').reduce((total, o) => total + o.valorTotal, 0))}
            </div>
            <p className="text-sm text-muted-foreground">Valor Aprovado</p>
          </CardContent>
        </Card>
      </div>

      {/* Orçamentos List */}
      <div className="grid gap-4">
        {filteredOrcamentos.map((orcamento) => (
          <Card key={orcamento.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{orcamento.numero}</h3>
                    <Badge className={getStatusColor(orcamento.status)}>
                      {orcamento.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Cliente: {orcamento.cliente}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>Projeto: {orcamento.projeto}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Emissão: {formatDate(orcamento.dataEmissao)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Validade: {formatDate(orcamento.dataValidade)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm">{orcamento.descricao}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(orcamento.valorTotal)}</div>
                    <div className="text-sm text-muted-foreground">
                      {orcamento.itens.length} item(s)
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
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(orcamento)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar por Email
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(orcamento.id)}
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
        
        {filteredOrcamentos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Nenhum orçamento encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'todos'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro orçamento'
                  }
                </p>
                {!searchTerm && statusFilter === 'todos' && (
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Orçamento
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FolderOpen,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  Target,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
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
import { Progress } from '@/components/ui/progress'
import { blink } from '@/blink/client'

interface RelatorioFinanceiro {
  periodo: string
  receitaTotal: number
  receitaAprovada: number
  receitaPendente: number
  numeroOrcamentos: number
  taxaAprovacao: number
  ticketMedio: number
}

interface RelatorioClientes {
  totalClientes: number
  novosClientes: number
  clientesAtivos: number
  leads: number
  prospects: number
  taxaConversao: number
  clientesPorTipo: {
    pessoaFisica: number
    pessoaJuridica: number
  }
}

interface RelatorioProjetos {
  totalProjetos: number
  projetosAtivos: number
  projetosConcluidos: number
  projetosAtrasados: number
  tempoMedioConclusao: number
  projetosPorTipo: {
    residencial: number
    comercial: number
    industrial: number
    reforma: number
  }
}

interface RelatorioPerformance {
  metaMensal: number
  realizadoMensal: number
  percentualMeta: number
  projetosNoPrazo: number
  projetosAtrasados: number
  satisfacaoCliente: number
  tempoRespostaMedio: number
}

export function Relatorios() {
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('mes-atual')
  const [tipoRelatorio, setTipoRelatorio] = useState('geral')
  
  const [relatorioFinanceiro, setRelatorioFinanceiro] = useState<RelatorioFinanceiro>({
    periodo: 'Julho 2024',
    receitaTotal: 1250000,
    receitaAprovada: 850000,
    receitaPendente: 400000,
    numeroOrcamentos: 15,
    taxaAprovacao: 68,
    ticketMedio: 83333
  })

  const [relatorioClientes, setRelatorioClientes] = useState<RelatorioClientes>({
    totalClientes: 24,
    novosClientes: 6,
    clientesAtivos: 18,
    leads: 8,
    prospects: 4,
    taxaConversao: 75,
    clientesPorTipo: {
      pessoaFisica: 16,
      pessoaJuridica: 8
    }
  })

  const [relatorioProjetos, setRelatorioProjetos] = useState<RelatorioProjetos>({
    totalProjetos: 12,
    projetosAtivos: 8,
    projetosConcluidos: 3,
    projetosAtrasados: 1,
    tempoMedioConclusao: 75,
    projetosPorTipo: {
      residencial: 7,
      comercial: 3,
      industrial: 1,
      reforma: 1
    }
  })

  const [relatorioPerformance, setRelatorioPerformance] = useState<RelatorioPerformance>({
    metaMensal: 1000000,
    realizadoMensal: 850000,
    percentualMeta: 85,
    projetosNoPrazo: 7,
    projetosAtrasados: 1,
    satisfacaoCliente: 92,
    tempoRespostaMedio: 4.2
  })

  useEffect(() => {
    loadRelatorios()
  }, [periodo])

  const loadRelatorios = async () => {
    setLoading(true)
    try {
      // Simular carregamento de dados baseado no período
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui conectaríamos com o banco de dados real
      // Os dados já estão definidos acima como exemplo
      
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getPeriodoLabel = (periodo: string) => {
    switch (periodo) {
      case 'mes-atual':
        return 'Mês Atual'
      case 'mes-anterior':
        return 'Mês Anterior'
      case 'trimestre':
        return 'Último Trimestre'
      case 'semestre':
        return 'Último Semestre'
      case 'ano':
        return 'Último Ano'
      default:
        return 'Mês Atual'
    }
  }

  const exportarRelatorio = () => {
    // Implementar exportação para PDF/Excel
    console.log('Exportando relatório...')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Análise de performance e métricas do negócio
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-48">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes-atual">Mês Atual</SelectItem>
              <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
              <SelectItem value="trimestre">Último Trimestre</SelectItem>
              <SelectItem value="semestre">Último Semestre</SelectItem>
              <SelectItem value="ano">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadRelatorios}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          
          <Button onClick={exportarRelatorio}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Resumo Executivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resumo Executivo - {getPeriodoLabel(periodo)}
          </CardTitle>
          <CardDescription>
            Principais indicadores de performance do período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Receita Aprovada</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(relatorioFinanceiro.receitaAprovada)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +15% vs período anterior
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Novos Clientes</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {relatorioClientes.novosClientes}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +20% vs período anterior
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Projetos Ativos</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {relatorioProjetos.projetosAtivos}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +12% vs período anterior
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Meta Mensal</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {formatPercentage(relatorioPerformance.percentualMeta)}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-red-500" />
                -5% vs período anterior
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Relatórios */}
      <Tabs defaultValue="financeiro" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financeiro">
            <DollarSign className="mr-2 h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="clientes">
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="projetos">
            <FolderOpen className="mr-2 h-4 w-4" />
            Projetos
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financeiro" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(relatorioFinanceiro.receitaTotal)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {relatorioFinanceiro.numeroOrcamentos} orçamentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Taxa de Aprovação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(relatorioFinanceiro.taxaAprovacao)}
                </div>
                <Progress value={relatorioFinanceiro.taxaAprovacao} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(relatorioFinanceiro.ticketMedio)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Por projeto aprovado
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Status</CardTitle>
                <CardDescription>
                  Distribuição da receita por status dos orçamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aprovada</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(relatorioFinanceiro.receitaAprovada)}
                    </span>
                  </div>
                  <Progress 
                    value={(relatorioFinanceiro.receitaAprovada / relatorioFinanceiro.receitaTotal) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pendente</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(relatorioFinanceiro.receitaPendente)}
                    </span>
                  </div>
                  <Progress 
                    value={(relatorioFinanceiro.receitaPendente / relatorioFinanceiro.receitaTotal) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>
                  Receita dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { mes: 'Jan', valor: 650000 },
                    { mes: 'Fev', valor: 720000 },
                    { mes: 'Mar', valor: 580000 },
                    { mes: 'Abr', valor: 890000 },
                    { mes: 'Mai', valor: 950000 },
                    { mes: 'Jun', valor: 850000 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.mes}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(item.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {relatorioClientes.totalClientes}
                </div>
                <p className="text-sm text-muted-foreground">
                  +{relatorioClientes.novosClientes} este mês
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Clientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {relatorioClientes.clientesAtivos}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatPercentage((relatorioClientes.clientesAtivos / relatorioClientes.totalClientes) * 100)} do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {relatorioClientes.leads}
                </div>
                <p className="text-sm text-muted-foreground">
                  Em prospecção
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Taxa de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatPercentage(relatorioClientes.taxaConversao)}
                </div>
                <Progress value={relatorioClientes.taxaConversao} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Tipo</CardTitle>
                <CardDescription>
                  Distribuição entre pessoa física e jurídica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pessoa Física</span>
                    <span className="text-sm font-medium">
                      {relatorioClientes.clientesPorTipo.pessoaFisica}
                    </span>
                  </div>
                  <Progress 
                    value={(relatorioClientes.clientesPorTipo.pessoaFisica / relatorioClientes.totalClientes) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pessoa Jurídica</span>
                    <span className="text-sm font-medium">
                      {relatorioClientes.clientesPorTipo.pessoaJuridica}
                    </span>
                  </div>
                  <Progress 
                    value={(relatorioClientes.clientesPorTipo.pessoaJuridica / relatorioClientes.totalClientes) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funil de Vendas</CardTitle>
                <CardDescription>
                  Conversão de leads para clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Leads</span>
                    <Badge variant="outline">{relatorioClientes.leads}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prospects</span>
                    <Badge variant="outline">{relatorioClientes.prospects}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Clientes Ativos</span>
                    <Badge className="bg-green-100 text-green-800">
                      {relatorioClientes.clientesAtivos}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projetos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Total de Projetos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {relatorioProjetos.totalProjetos}
                </div>
                <p className="text-sm text-muted-foreground">
                  Todos os projetos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Projetos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {relatorioProjetos.projetosAtivos}
                </div>
                <p className="text-sm text-muted-foreground">
                  Em andamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {relatorioProjetos.projetosConcluidos}
                </div>
                <p className="text-sm text-muted-foreground">
                  Finalizados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tempo Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {relatorioProjetos.tempoMedioConclusao} dias
                </div>
                <p className="text-sm text-muted-foreground">
                  Para conclusão
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Projetos por Tipo</CardTitle>
                <CardDescription>
                  Distribuição dos projetos por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(relatorioProjetos.projetosPorTipo).map(([tipo, quantidade]) => (
                  <div key={tipo} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm capitalize">{tipo}</span>
                      <span className="text-sm font-medium">{quantidade}</span>
                    </div>
                    <Progress 
                      value={(quantidade / relatorioProjetos.totalProjetos) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Projetos</CardTitle>
                <CardDescription>
                  Situação atual dos projetos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No Prazo</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {relatorioPerformance.projetosNoPrazo}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Atrasados</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    {relatorioPerformance.projetosAtrasados}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Em Andamento</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {relatorioProjetos.projetosAtivos}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Meta Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(relatorioPerformance.percentualMeta)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(relatorioPerformance.realizadoMensal)} de {formatCurrency(relatorioPerformance.metaMensal)}
                </p>
                <Progress value={relatorioPerformance.percentualMeta} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Satisfação Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(relatorioPerformance.satisfacaoCliente)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Avaliação média
                </p>
                <Progress value={relatorioPerformance.satisfacaoCliente} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tempo de Resposta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {relatorioPerformance.tempoRespostaMedio}h
                </div>
                <p className="text-sm text-muted-foreground">
                  Tempo médio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Projetos no Prazo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {formatPercentage((relatorioPerformance.projetosNoPrazo / (relatorioPerformance.projetosNoPrazo + relatorioPerformance.projetosAtrasados)) * 100)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {relatorioPerformance.projetosNoPrazo} de {relatorioPerformance.projetosNoPrazo + relatorioPerformance.projetosAtrasados}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Qualidade</CardTitle>
                <CardDescription>
                  Métricas de qualidade do atendimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satisfação do Cliente</span>
                    <span className="text-sm font-medium">
                      {formatPercentage(relatorioPerformance.satisfacaoCliente)}
                    </span>
                  </div>
                  <Progress value={relatorioPerformance.satisfacaoCliente} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Aprovação</span>
                    <span className="text-sm font-medium">
                      {formatPercentage(relatorioFinanceiro.taxaAprovacao)}
                    </span>
                  </div>
                  <Progress value={relatorioFinanceiro.taxaAprovacao} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Projetos no Prazo</span>
                    <span className="text-sm font-medium">
                      {formatPercentage((relatorioPerformance.projetosNoPrazo / (relatorioPerformance.projetosNoPrazo + relatorioPerformance.projetosAtrasados)) * 100)}
                    </span>
                  </div>
                  <Progress 
                    value={(relatorioPerformance.projetosNoPrazo / (relatorioPerformance.projetosNoPrazo + relatorioPerformance.projetosAtrasados)) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas vs Realizado</CardTitle>
                <CardDescription>
                  Comparativo de metas e resultados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Meta de Receita</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(relatorioPerformance.metaMensal)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Realizado</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(relatorioPerformance.realizadoMensal)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Percentual Atingido</span>
                    <Badge className={relatorioPerformance.percentualMeta >= 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {formatPercentage(relatorioPerformance.percentualMeta)}
                    </Badge>
                  </div>
                  
                  <Progress value={relatorioPerformance.percentualMeta} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
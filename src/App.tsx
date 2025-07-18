import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'
import { Projetos } from '@/pages/Projetos'
import { Clientes } from '@/pages/Clientes'
import { Orcamentos } from '@/pages/Orcamentos'
import { Cronogramas } from '@/pages/Cronogramas'
import { Comunicacao } from '@/pages/Comunicacao'
import { Relatorios } from '@/pages/Relatorios'
import { blink } from '@/blink/client'

function App() {
  const [currentPage, setCurrentPage] = useState('/')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">ArchiCRM</h1>
          <p className="text-muted-foreground">Faça login para acessar o sistema</p>
          <button 
            onClick={() => blink.auth.login()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case '/':
        return 'Dashboard'
      case '/clientes':
        return 'Clientes'
      case '/projetos':
        return 'Projetos'
      case '/orcamentos':
        return 'Orçamentos'
      case '/cronogramas':
        return 'Cronogramas'
      case '/comunicacao':
        return 'Comunicação'
      case '/relatorios':
        return 'Relatórios'
      default:
        return 'Dashboard'
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard />
      case '/projetos':
        return <Projetos />
      case '/clientes':
        return <Clientes />
      case '/orcamentos':
        return <Orcamentos />
      case '/cronogramas':
        return <Cronogramas />
      case '/comunicacao':
        return <Comunicacao />
      case '/relatorios':
        return <Relatorios />
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar 
        activeItem={currentPage} 
        onItemClick={setCurrentPage} 
      />
      <SidebarInset>
        <Header 
          title={getPageTitle()} 
          user={user}
        />
        <main className="flex-1 space-y-4 p-6 bg-background min-h-screen">
          {renderPage()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
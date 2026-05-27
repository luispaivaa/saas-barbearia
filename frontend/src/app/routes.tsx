import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { NovoAgendamento } from './pages/NovoAgendamento';
import { AgendaBarbeiro } from './pages/AgendaBarbeiro';
import { DashboardBarbeiro } from './pages/DashboardBarbeiro';
import { Disponibilidade } from './pages/Disponibilidade';
import { MeusHorarios } from './pages/MeusHorarios';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { RecuperarSenha } from './pages/RecuperarSenha';
import { MeuPerfil } from './pages/MeuPerfil';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFound } from './pages/NotFound';
import { useAuth } from './context/AuthContext';

function HomeIndex() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (role === 'BARBEIRO') {
    return <DashboardBarbeiro />;
  }

  return <NovoAgendamento />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/cadastro',
    element: <Cadastro />,
  },
  {
    path: '/recuperar-senha',
    element: <RecuperarSenha />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomeIndex />,
      },
      {
        path: 'dashboard-barbeiro',
        element: <DashboardBarbeiro />,
      },
      {
        path: 'agenda',
        element: <AgendaBarbeiro />,
      },
      {
        path: 'meus-horarios',
        element: <MeusHorarios />,
      },
      {
        path: 'disponibilidade',
        element: <Disponibilidade />,
      },
      {
        path: 'perfil',
        element: <MeuPerfil />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

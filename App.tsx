
import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginScreen } from './components/views/LoginScreen';
import Layout from './components/layout/Layout';
import Dashboard from './components/views/Dashboard';
import CreateTicket from './components/views/CreateTicket';
import TicketDetailView from './components/views/TicketDetailView';
import AdminPanel from './components/views/AdminPanel';
import Reports from './components/views/Reports';
import Spinner from './components/ui/Spinner';

const App: React.FC = () => {
  const { user, page, selectedTicketId, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    if (selectedTicketId) {
      return <TicketDetailView ticketId={selectedTicketId} />;
    }
    switch (page) {
      case 'dashboard':
        return <Dashboard />;
      case 'create-ticket':
        return <CreateTicket />;
      case 'reports':
        return <Reports />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderContent()}</Layout>;
};

export default App;
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Role } from '../../types';
import Card from '../ui/Card';

const AdminPanel: React.FC = () => {
  const { users, updateUserProfile, user: currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(`¿Estás seguro de que deseas cambiar el rol de este usuario a ${newRole}?`)) {
      updateUserProfile(userId, { role: newRole as Role });
    }
  };

  const handleManagerChange = (userId: string, managerEmail: string) => {
    updateUserProfile(userId, { manager: managerEmail });
  };

  if (currentUser?.role !== Role.Administrador) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
        <h3 className="text-lg font-medium">Acceso Denegado</h3>
        <p>Solo los administradores pueden ver esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>

      <Card title="Gestión de Usuarios y Roles">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol Actual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área / Sucursal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Jefe Directo (Aprobador)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === Role.Administrador ? 'bg-purple-100 text-purple-800' :
                        user.role === Role.MejoraContinua ? 'bg-blue-100 text-blue-800' :
                          user.role === Role.JefeDirecto ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-y-1">
                    <input
                      type="text"
                      value={user.area || ''}
                      onChange={(e) => updateUserProfile(user.id, { area: e.target.value })}
                      placeholder="Área (ej: Ventas)"
                      className="block w-full text-xs border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                    />
                    <input
                      type="text"
                      value={user.sucursal || ''}
                      onChange={(e) => updateUserProfile(user.id, { sucursal: e.target.value })}
                      placeholder="Sucursal"
                      className="block w-full text-xs border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="email"
                      value={user.manager || ''}
                      onChange={(e) => handleManagerChange(user.id, e.target.value)}
                      placeholder="email@jefe.com"
                      className="block w-full text-sm border-gray-300 rounded-md focus:ring-accent focus:border-accent"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
                    >
                      {Object.values(Role).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No se encontraron usuarios.
            </div>
          )}
        </div>
      </Card>

      <Card title="Configuración del Sistema">
        <p className="text-gray-600">
          Próximamente: Gestión de Áreas, Categorías y SLAs.
        </p>
      </Card>
    </div>
  );
};

export default AdminPanel;

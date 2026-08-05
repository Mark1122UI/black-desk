'use client';

import { useState } from 'react';
import { Shield, Plus, Check, X } from 'lucide-react';

const INITIAL_PERMISSIONS: Record<string, Record<string, boolean>> = {
  Users: { 'Super Admin': true, Admin: true, Manager: true, Employee: false },
  Teams: { 'Super Admin': true, Admin: true, Manager: true, Employee: true },
  Departments: { 'Super Admin': true, Admin: true, Manager: false, Employee: false },
  CRM: { 'Super Admin': true, Admin: true, Manager: true, Employee: true },
  Projects: { 'Super Admin': true, Admin: true, Manager: true, Employee: true },
  Workflows: { 'Super Admin': true, Admin: true, Manager: false, Employee: false },
  Billing: { 'Super Admin': true, Admin: false, Manager: false, Employee: false },
};

export default function RolesPage() {
  const [roles, setRoles] = useState(['Super Admin', 'Admin', 'Manager', 'Employee']);
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(INITIAL_PERMISSIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const togglePermission = (resource: string, role: string) => {
    setMatrix((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [role]: !prev[resource]?.[role],
      },
    }));
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim() || roles.includes(newRoleName)) return;

    setRoles([...roles, newRoleName]);

    const updatedMatrix = { ...matrix };
    Object.keys(updatedMatrix).forEach((res) => {
      updatedMatrix[res] = { ...updatedMatrix[res], [newRoleName]: false };
    });
    setMatrix(updatedMatrix);

    setNewRoleName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Roles & Permissions Matrix
          </h2>
          <p className="text-muted-foreground text-sm">Configure organization RBAC security permissions and access control.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} /> Custom Role
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500 w-1/3">Resource Module</th>
                {roles.map((role) => (
                  <th key={role} className="px-6 py-4 font-medium text-center text-gray-900 dark:text-white">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {Object.keys(matrix).map((resource) => (
                <tr key={resource} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">{resource}</div>
                    <span className="text-xs text-gray-400">Read / Write / Execute</span>
                  </td>
                  {roles.map((role) => {
                    const isGranted = matrix[resource]?.[role];
                    return (
                      <td key={role} className="px-6 py-4 text-center align-middle">
                        <button
                          onClick={() => togglePermission(resource, role)}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer ${
                            isGranted
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500 hover:bg-green-200'
                              : 'border border-gray-200 dark:border-zinc-700 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {isGranted ? <Check size={14} /> : <span className="text-xs">-</span>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Create Custom Role</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRole} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-zinc-300">Role Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sales Lead, Security Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

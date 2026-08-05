'use client';

import { useState } from 'react';
import { Building2, Plus, MoreHorizontal, X } from 'lucide-react';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([
    { id: '1', name: 'Engineering', head: 'Sarah Connor', teams: 4, members: 42 },
    { id: '2', name: 'Marketing', head: 'John Smith', teams: 2, members: 12 },
    { id: '3', name: 'Sales', head: 'Jane Doe', teams: 3, members: 25 },
    { id: '4', name: 'Customer Support', head: 'Alex Johnson', teams: 2, members: 18 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('');

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    const newDept = {
      id: Date.now().toString(),
      name: deptName,
      head: deptHead || 'Unassigned',
      teams: 1,
      members: 1,
    };

    setDepartments([...departments, newDept]);
    setDeptName('');
    setDeptHead('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Departments</h2>
          <p className="text-muted-foreground text-sm">High-level organizational units and leadership structures.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} /> New Department
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Department Name</th>
              <th className="px-6 py-4 font-medium">Department Head</th>
              <th className="px-6 py-4 font-medium">Total Teams</th>
              <th className="px-6 py-4 font-medium">Total Members</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <Building2 size={16} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{dept.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-zinc-300">{dept.head}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-zinc-300">{dept.teams}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-zinc-300">{dept.members}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Create New Department</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-zinc-300">Department Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Research & Development"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-zinc-300">Department Head</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Emmett Brown"
                  value={deptHead}
                  onChange={(e) => setDeptHead(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3 py-2 text-sm"
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
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

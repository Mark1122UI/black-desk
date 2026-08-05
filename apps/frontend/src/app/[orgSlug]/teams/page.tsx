'use client';

import { useState } from 'react';
import { Users, Plus, MoreHorizontal, X, Building2, CheckCircle2 } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([
    { id: '1', name: 'Frontend Engineering', members: 12, dept: 'Engineering', color: 'bg-blue-500' },
    { id: '2', name: 'Product Marketing', members: 5, dept: 'Marketing', color: 'bg-purple-500' },
    { id: '3', name: 'Customer Success US', members: 8, dept: 'Support', color: 'bg-green-500' },
    { id: '4', name: 'DevOps & Cloud', members: 6, dept: 'Engineering', color: 'bg-amber-500' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('Engineering');
  const [newTeamColor, setNewTeamColor] = useState('bg-blue-500');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const newTeam = {
      id: Date.now().toString(),
      name: newTeamName,
      dept: newTeamDept,
      members: 1,
      color: newTeamColor,
    };

    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Teams</h2>
          <p className="text-muted-foreground text-sm">Organize members into functional, high-performing teams.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-16 relative">
              <div className={`absolute inset-0 opacity-20 ${team.color}`}></div>
              <div className="absolute right-2 top-2 p-1 bg-white/50 dark:bg-black/50 rounded-md backdrop-blur-sm cursor-pointer hover:bg-white dark:hover:bg-zinc-800">
                <MoreHorizontal size={16} className="text-gray-700 dark:text-gray-300" />
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 relative -mt-6">
              <div className={`w-12 h-12 rounded-lg ${team.color} flex items-center justify-center text-white shadow-lg border-2 border-white dark:border-zinc-900`}>
                <Users size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">{team.dept}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex -space-x-2 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-gray-200 dark:bg-zinc-700" />
                  ))}
                  <div className="inline-flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-gray-100 dark:bg-zinc-800 text-[10px] font-medium text-gray-500">
                    +{Math.max(0, team.members - 3)}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeam(team)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Team
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Create New Team</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-zinc-300">Team Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Engineering"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-zinc-300">Department</label>
                <select
                  value={newTeamDept}
                  onChange={(e) => setNewTeamDept(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3 py-2 text-sm"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support">Support</option>
                  <option value="Product">Product</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-zinc-300">Team Accent Color</label>
                <div className="flex gap-2">
                  {['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500', 'bg-rose-500'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTeamColor(color)}
                      className={`w-8 h-8 rounded-full ${color} ${newTeamColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    />
                  ))}
                </div>
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Team Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${selectedTeam.color} flex items-center justify-center text-white`}>
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-900 dark:text-white">{selectedTeam.name}</h3>
                  <p className="text-xs text-gray-500">{selectedTeam.dept} Department</p>
                </div>
              </div>
              <button onClick={() => setSelectedTeam(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Team Members ({selectedTeam.members})</p>
              {['Alex Johnson (Lead)', 'Sarah Connor', 'John Smith'].map((name, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {name[0]}
                    </div>
                    <span className="text-xs font-medium text-gray-800 dark:text-zinc-200">{name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">Active</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkspaceDashboardPage({ params }: { params: { orgSlug: string, workspaceId: string } }) {
  return (
    <div className="space-y-6">
      
      {/* Welcome Card */}
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-primary/10 to-blue-600/10 dark:from-primary/20 dark:to-blue-600/20 p-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Good morning, John!</h2>
        <p className="text-gray-500 dark:text-zinc-400 mt-1">Here is what's happening in your workspace today.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'New Project', href: `/${params.orgSlug}/projects` },
              { label: 'Create Task', href: `/${params.orgSlug}/projects/tasks` },
              { label: 'Schedule Meeting', href: `/${params.orgSlug}/crm/meetings` },
              { label: 'Ask AI', href: `/${params.orgSlug}/knowledge` },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-primary text-lg">+</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-zinc-300">{action.label}</span>
              </a>
            ))}
          </div>

          {/* Assigned Tasks & Upcoming Meetings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Assigned Tasks</h3>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <div className="mt-0.5 h-4 w-4 rounded border border-gray-300 dark:border-zinc-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Review Q3 Marketing Plan</p>
                      <p className="text-xs text-red-500 mt-1">Due Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Meetings</h3>
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                      10:00
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">Sync with Design Team</p>
                      <p className="text-xs text-gray-500 mt-1">Google Meet</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Recent Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 rounded-lg border border-gray-100 dark:border-zinc-800/80 hover:border-primary/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-sm font-medium">Project Apollo {i}</p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5 mt-4">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Shortcut */}
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="font-semibold mb-2 relative z-10">Ask AI Assistant</h3>
            <p className="text-sm text-indigo-100 mb-4 relative z-10">Generate reports, summarize meetings, or find files instantly.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 rounded-lg text-sm font-medium transition-colors relative z-10">
              Open Assistant (⌘J)
            </button>
          </div>

          {/* Workspace Overview & Pinned Items */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Workspace Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Members</span>
                <span className="font-medium text-gray-900 dark:text-white">24 Active</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Storage</span>
                <span className="font-medium text-gray-900 dark:text-white">45 GB / 100 GB</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Pinned Items</h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-600 dark:text-zinc-300 flex items-center hover:text-primary cursor-pointer">
                <span className="mr-2">📄</span> Q3 Financial Report.pdf
              </li>
              <li className="text-sm text-gray-600 dark:text-zinc-300 flex items-center hover:text-primary cursor-pointer">
                <span className="mr-2">🔗</span> Marketing Campaign Assets
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

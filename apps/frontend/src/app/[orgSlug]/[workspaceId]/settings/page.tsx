'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function WorkspaceSettingsPage({ params }: { params: { orgSlug: string, workspaceId: string } }) {
  const { orgSlug, workspaceId } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      color: '#3b82f6',
    }
  });

  useEffect(() => {
    apiFetch(`/organizations/${orgSlug}/workspaces/${workspaceId}`)
      .then((workspace) => {
        reset({
          name: workspace.name || '',
          description: workspace.description || '',
          color: workspace.color || '#3b82f6',
        });
      })
      .catch((err) => console.error('Failed to load workspace settings:', err))
      .finally(() => setLoading(false));
  }, [orgSlug, workspaceId, reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await apiFetch(`/organizations/${orgSlug}/workspaces/${workspaceId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to update workspace:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Workspace Settings</h2>
        <p className="text-muted-foreground">Manage your workspace preferences.</p>
      </div>
      
      <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Workspace Name</label>
              <input {...register('name')} className="w-full md:w-1/2 rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea {...register('description')} rows={3} className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand Color</label>
              <input type="color" {...register('color')} className="h-10 w-20 rounded border border-gray-300 dark:border-zinc-700 cursor-pointer" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button type="submit" disabled={saving || loading} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="border border-red-200 dark:border-red-900/50 rounded-lg p-6 bg-red-50 dark:bg-red-950/20">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">Once you delete a workspace, there is no going back. Please be certain.</p>
        <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
          Delete Workspace
        </button>
      </div>
    </div>
  );
}

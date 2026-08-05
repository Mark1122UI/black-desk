'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function OrganizationSettingsPage({ params }: { params: { orgSlug: string } }) {
  const { orgSlug } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      legalName: '',
      industry: '',
      companySize: '',
      address: '',
      city: '',
      country: '',
    }
  });

  useEffect(() => {
    apiFetch(`/organizations/${orgSlug}`)
      .then((org) => {
        reset({
          name: org.name || '',
          legalName: org.legalName || '',
          industry: org.industry || '',
          companySize: org.companySize || '',
          address: org.address || '',
          city: org.city || '',
          country: org.country || '',
        });
      })
      .catch((err) => console.error('Failed to load org settings:', err))
      .finally(() => setLoading(false));
  }, [orgSlug, reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await apiFetch(`/organizations/${orgSlug}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error('Failed to update organization:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">Manage your organization's profile and preferences.</p>
      </div>
      
      <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input {...register('name')} className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Legal Name</label>
              <input {...register('legalName')} className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <select {...register('industry')} className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm">
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Size</label>
              <select {...register('companySize')} className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm">
                <option value="1-10">1-10</option>
                <option value="51-200">51-200</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input {...register('address')} className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving || loading} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

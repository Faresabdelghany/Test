import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';
import { useAuth } from './useAuth';

export function useApplications() {
  const { user, isAdmin } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Admins see all applications, users see only their own
      const apps = await storage.getApplications(isAdmin ? null : user.id);
      setApplications(apps);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user, loadApplications]);

  const createApplication = async (appData) => {
    try {
      // Handle file upload if present
      let fileUrl = null;
      if (appData.file && appData.file instanceof File) {
        fileUrl = await storage.uploadFile(appData.file, user.id);
      }

      const newApp = await storage.createApplication({
        user_id: user.id,
        title: appData.title,
        email: appData.email,
        password: appData.password || null,
        phone: appData.phone || null,
        website: appData.website || null,
        number_value: appData.number ? parseInt(appData.number, 10) : null,
        range_value: appData.range ? parseInt(appData.range, 10) : 50,
        date_value: appData.date || null,
        time_value: appData.time || null,
        datetime_value: appData.datetime || null,
        color_value: appData.color || '#000000',
        file_url: fileUrl,
        category: appData.category || 'A',
        terms_accepted: appData.termsAccepted || false,
        description: appData.description || null,
      });

      setApplications((prev) => [newApp, ...prev]);
      return newApp;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateApplication = async (id, updates) => {
    try {
      // Handle file upload if present
      let fileUrl = updates.file_url;
      if (updates.file && updates.file instanceof File) {
        fileUrl = await storage.uploadFile(updates.file, user.id);
      }

      const updatedApp = await storage.updateApplication(id, {
        title: updates.title,
        email: updates.email,
        password: updates.password || null,
        phone: updates.phone || null,
        website: updates.website || null,
        number_value: updates.number ? parseInt(updates.number, 10) : null,
        range_value: updates.range ? parseInt(updates.range, 10) : 50,
        date_value: updates.date || null,
        time_value: updates.time || null,
        datetime_value: updates.datetime || null,
        color_value: updates.color || '#000000',
        file_url: fileUrl,
        category: updates.category || 'A',
        terms_accepted: updates.termsAccepted || false,
        description: updates.description || null,
      });

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updatedApp : app))
      );
      return updatedApp;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteApplication = async (id) => {
    try {
      // Find the application to get file URL for deletion
      const app = applications.find((a) => a.id === id);
      if (app?.file_url) {
        await storage.deleteFile(app.file_url);
      }

      await storage.deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const setStatus = async (id, status) => {
    try {
      const updatedApp = await storage.updateApplicationStatus(id, status);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updatedApp : app))
      );
      return updatedApp;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    setStatus,
    refresh: loadApplications,
  };
}

import { supabase } from './supabase';

export const storage = {
  // ============ AUTH ============

  signUp: async ({ email, password, firstName, lastName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  getCurrentSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // ============ PROFILES ============

  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  isAdmin: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data?.is_admin || false;
  },

  // ============ APPLICATIONS ============

  getApplications: async (userId = null) => {
    let query = supabase
      .from('applications')
      .select('*, profiles(email, first_name, last_name)')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getApplication: async (id) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createApplication: async (application) => {
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateApplication: async (id, updates) => {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteApplication: async (id) => {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw error;
  },

  updateApplicationStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ============ FILE STORAGE ============

  uploadFile: async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('application-files')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('application-files').getPublicUrl(fileName);

    return publicUrl;
  },

  deleteFile: async (fileUrl) => {
    if (!fileUrl) return;
    const path = fileUrl.split('/application-files/')[1];
    if (path) {
      const { error } = await supabase.storage
        .from('application-files')
        .remove([path]);
      if (error) throw error;
    }
  },
};

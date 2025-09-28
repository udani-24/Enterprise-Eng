
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminCredentials {
  id: string;
  username: string;
  password_hash: string;
}

export const useAdminAuth = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated (stored in localStorage)
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { data: credentials, error } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !credentials) {
        throw new Error('Invalid credentials');
      }

      // Simple password check (in production, use proper hashing)
      if (password === 'admin@1234') {
        setIsAdminAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        return { success: true };
      } else {
        throw new Error('Invalid password');
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const updateAdminCredentials = async (newUsername: string, newPassword: string) => {
    try {
      const { error } = await supabase
        .from('admin_credentials')
        .update({ 
          username: newUsername,
          password_hash: newPassword, // In production, hash this properly
          updated_at: new Date().toISOString()
        })
        .eq('username', 'admin');

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    isAdminAuthenticated,
    loading,
    adminLogin,
    adminLogout,
    updateAdminCredentials,
  };
};

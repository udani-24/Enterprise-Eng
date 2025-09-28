
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';

interface AdminLoginProps {
  onBack: () => void;
}

const AdminLogin = ({ onBack }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin, loading, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect immediately to dashboard
    if (isAdminAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminLogin(username, password);

    if (!result.success) {
      toast.error(result.error || 'Login failed');
    } else {
      toast.success('Admin login successful!');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-cyan-900/90">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <Button 
            onClick={onBack} 
            variant="ghost" 
            size="sm"
            className="absolute top-4 left-4 text-blue-200 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-2xl w-fit shadow-xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">Admin Portal</CardTitle>
            <CardDescription className="text-blue-100">
              Sign in to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="text-blue-100">Username</Label>
              <Input
                id="admin-username"
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-blue-100">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
              />
            </div>
            <div className="text-sm text-blue-200 bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
              <strong className="text-cyan-400">Default credentials:</strong><br />
              Username: <br />
              Password: 
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;


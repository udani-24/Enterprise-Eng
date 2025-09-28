
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Heart, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';
import AdminLogin from '@/components/admin/AdminLogin';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAdminAuthenticated } = useAdminAuth();

  const handlePatientSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'patient',
          },
        },
      });

      if (error) throw error;
      
      toast.success('Patient account created successfully! You can now sign in.');
      
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to admin dashboard if already authenticated
  if (isAdminAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  if (showAdminLogin) {
    return <AdminLogin onBack={() => setShowAdminLogin(false)} />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if doctor ID is unique
      const { data: existingDoctor, error: checkError } = await supabase
        .from('profiles')
        .select('doctor_id')
        .eq('doctor_id', doctorId)
        .single();

      if (existingDoctor) {
        toast.error('Doctor ID already exists. Please choose a different one.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'doctor',
            doctor_id: doctorId,
          },
        },
      });

      if (error) throw error;
      
      toast.success('Doctor account created successfully! Your account is pending admin approval.');
      
      setEmail('');
      setPassword('');
      setFullName('');
      setDoctorId('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Shield, text: "HIPAA Compliant Security" },
    { icon: Users, text: "Multi-User Access" },
    { icon: Heart, text: "Patient-Centered Care" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Welcome Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl shadow-2xl">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Medical Portal
              </h1>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to the
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Future of Healthcare
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Secure, efficient, and comprehensive medical record management 
              designed for modern healthcare professionals.
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                  <feature.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-blue-100 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm text-blue-200">Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-blue-200">Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-blue-200">Uptime</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-2xl w-fit shadow-xl">
                <Stethoscope className="h-10 w-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Access Your Portal</CardTitle>
                <CardDescription className="text-blue-100">
                  Sign in to manage patient records and healthcare data
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="signin" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border-white/20">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200"
                  >
                    Doctor Signup
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-blue-100">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-blue-100">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300" 
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : 'Sign In to Portal'}
                    </Button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      onClick={() => setShowAdminLogin(true)}
                      variant="ghost"
                      className="text-blue-200 hover:text-white hover:bg-white/10"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Login
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-blue-100">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-doctor-id" className="text-blue-100">Doctor ID</Label>
                      <Input
                        id="signup-doctor-id"
                        type="text"
                        placeholder="Enter your doctor ID (e.g., DR001)"
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-blue-100">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-blue-100">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-cyan-400"
                      />
                    </div>
                    <div className="text-sm text-blue-200 bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                      <strong className="text-cyan-400">Note:</strong> Doctor accounts require admin approval before access is granted.
                      Only approved doctors can access the medical portal.
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Doctor Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

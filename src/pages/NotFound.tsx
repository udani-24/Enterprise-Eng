
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Stethoscope, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80"
          alt="Medical equipment background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/90 to-cyan-900/95"></div>
      </div>
      
      {/* Floating Medical Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-20 animate-bounce delay-300">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Stethoscope className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
        <div className="absolute top-40 right-32 animate-bounce delay-700">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Search className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="absolute bottom-32 left-40 animate-bounce delay-500">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Home className="h-10 w-10 text-purple-400" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl max-w-md mx-auto">
          <CardContent className="p-12">
            {/* 404 Text */}
            <div className="mb-8">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full mb-6"></div>
            </div>
            
            {/* Error Message */}
            <h2 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              The medical page you're looking for seems to have been moved or doesn't exist. 
              Let's get you back to a healthy state!
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            {/* Medical Quote */}
            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-blue-200 italic">
                "Health is not valued till sickness comes."
              </p>
              <p className="text-xs text-blue-300 mt-1">- Dr. Thomas Fuller</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20"></div>
    </div>
  );
};

export default NotFound;

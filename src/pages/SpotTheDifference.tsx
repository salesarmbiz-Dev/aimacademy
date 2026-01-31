import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowLeft, Lock, MessageSquare, Mail, Megaphone, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 'social-media',
    name: 'Social Media',
    icon: MessageSquare,
    description: 'โพสต์ IG, FB, Twitter',
    count: 20,
    color: 'turquoise',
    available: false,
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    description: 'อีเมลธุรกิจ, Customer Support',
    count: 15,
    color: 'tennessee',
    available: false,
  },
  {
    id: 'ad-copy',
    name: 'Ad Copy',
    icon: Megaphone,
    description: 'โฆษณา, Landing Page',
    count: 18,
    color: 'turquoise',
    available: false,
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    icon: Headphones,
    description: 'ตอบลูกค้า, FAQ',
    count: 12,
    color: 'tennessee',
    available: false,
  },
];

const SpotTheDifference: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-lg bg-card hover:bg-rackley/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-rackley" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-turquoise/20 rounded-xl">
              <Eye className="w-8 h-8 text-turquoise" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                🎯 Spot the Difference
              </h1>
              <p className="text-rackley">จับผิด 2 Prompts - อันไหนดีกว่า?</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <Card className="bg-gradient-to-r from-turquoise/20 to-tennessee/20 border-turquoise/50 mb-8">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-turquoise/20 flex items-center justify-center animate-pulse-glow">
              <Eye className="w-8 h-8 text-turquoise" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">🚧 Coming Soon</h2>
            <p className="text-rackley mb-4">
              เกม Spot the Difference กำลังพัฒนา - เร็วๆ นี้!
            </p>
            <Badge variant="outline" className="border-turquoise text-turquoise">
              กำลังพัฒนา
            </Badge>
          </CardContent>
        </Card>

        {/* Categories Preview */}
        <h2 className="text-lg font-bold text-foreground mb-4">📂 หมวดหมู่ที่จะมี</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`bg-card border-rackley/30 opacity-60 cursor-not-allowed`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${category.color}/20 rounded-lg`}>
                      <category.icon className={`w-6 h-6 text-${category.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <p className="text-rackley text-sm">{category.description}</p>
                    </div>
                  </div>
                  <Lock className="w-5 h-5 text-rackley" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-rackley">{category.count} ข้อ</span>
                  <Badge variant="outline" className="text-rackley border-rackley/50 text-xs">
                    เร็วๆ นี้
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button asChild variant="outline" className="border-rackley text-rackley hover:bg-rackley/10">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpotTheDifference;

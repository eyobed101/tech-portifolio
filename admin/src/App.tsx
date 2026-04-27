import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Globe, Settings, Activity, Search, LogOut, Menu, X, Briefcase, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/Projects';
import JobsPage from './pages/Jobs';
import PostsPage from './pages/Posts';
import FeaturedPage from './pages/Featured';
import Login from './pages/Login';
import SettingsPage from './pages/Settings';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: Globe, path: '/projects' },
    { name: 'Jobs', icon: Briefcase, path: '/jobs' },
    { name: 'Blog', icon: FileText, path: '/blog' },
    { name: 'Featured', icon: BarChart2, path: '/featured' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const SidebarContent = () => (
    <>
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'} lg:h-20 transition-all`}>
        {!isCollapsed && (
          <div className="flex items-center animate-in fade-in duration-300">
            <Globe className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-bold text-xl tracking-wide">E.E</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center p-1.5 rounded-lg bg-[#1f2937]/30 hover:bg-[#19222e] border border-[#1f2937] text-gray-400 hover:text-white transition-all shadow-lg"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-[#1f2937] text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center ${isCollapsed ? 'lg:justify-center' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-[#1f2937]/50'
                }`}
              title={isCollapsed ? item.name : ''}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1f2937]">
        <button
          onClick={logout}
          className={`flex items-center w-full ${isCollapsed ? 'lg:justify-center' : 'px-3'} py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#0e121a]">
      {/* Sidebar Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 ${isCollapsed ? 'w-20' : 'w-64'} bg-[#141a23] border-r border-[#1f2937] transition-all duration-300 ease-in-out`}>
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#141a23] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 bg-[#0e121a] border-b border-[#1f2937] lg:border-none">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 mr-4 rounded-xl bg-[#141a23] border border-[#1f2937] text-gray-400 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-wide truncate max-w-[200px] lg:max-w-none">
              {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="hidden sm:flex items-center mr-2 lg:mr-4 text-sm text-gray-400 font-medium">
              {user?.name}
            </div>
            <button className="p-2 rounded-xl hover:bg-[#1f2937] text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-blue-500/10">
              <div className="w-full h-full rounded-[11px] bg-[#141a23] overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0e121a] p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e121a] flex items-center justify-center">
        <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
      </div>
    );
  }

  if (!token) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/blog" element={<PostsPage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<div className="text-gray-400 flex items-center justify-center h-full">Under Construction</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

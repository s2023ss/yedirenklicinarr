import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Users,
    BookOpen,
    LayoutDashboard,
    Settings,
    LogOut,
    Upload,
    Menu,
    X,
    GraduationCap,
    Trophy,
    HelpCircle,
    Bell,
    Search,
    ClipboardList
} from 'lucide-react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    to: string;
}

const SidebarLink: React.FC<SidebarItemProps> = ({ icon: Icon, label, to }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-500 hover:bg-white hover:text-primary-600 hover:shadow-sm'
            }`
        }
    >
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
    </NavLink>
);

export const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { profile, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#f8fafc] font-sans antialiased text-slate-900">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transform transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0 shadow-xl lg:shadow-none`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Section */}
                    <div className="px-8 py-10 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/40 rotate-3">
                            <GraduationCap size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 leading-none">Yedi Renkli</span>
                            <span className="text-xs font-bold text-primary-500 tracking-[0.2em] uppercase mt-1">Akademi</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Ana Menü</div>
                        {profile?.role !== 'student' && (
                            <>
                                <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/" />
                                <SidebarLink icon={BookOpen} label="Akademik Yapı" to="/academic" />
                                <SidebarLink icon={HelpCircle} label="Soru Bankası" to="/questions" />
                                <SidebarLink icon={Upload} label="Toplu Soru Yükleme" to="/questions/bulk" />
                                <SidebarLink icon={ClipboardList} label="Sınavlar" to="/exams" />
                            </>
                        )}
                        {profile?.role === 'student' && (
                            <>
                                <SidebarLink icon={LayoutDashboard} label="Genel Bakış" to="/" />
                                <SidebarLink icon={ClipboardList} label="Sınavlarım" to="/student/exams" />
                                <SidebarLink icon={Trophy} label="Rozetlerim" to="/achievements" />
                            </>
                        )}

                        <div className="pt-6 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Yönetim</div>
                        {profile?.role === 'admin' && (
                            <SidebarLink icon={Users} label="Kullanıcılar" to="/users" />
                        )}
                        <SidebarLink icon={Trophy} label="Rozetler" to="/achievements" />
                        <SidebarLink icon={Settings} label="Ayarlar" to="/settings" />
                    </nav>

                    {/* Profile & Footer */}
                    <div className="p-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <LogOut size={20} />
                            </div>
                            <span className="font-bold">Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Modern Header */}
                <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Search Bar (Fake for UI) */}
                        <div className="hidden md:flex items-center gap-3 bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200/40 w-80">
                            <Search size={18} className="text-slate-400" />
                            <input type="text" placeholder="Hızlı ara..." className="bg-transparent border-none text-sm outline-none w-full" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">{profile?.full_name || 'Yükleniyor...'}</p>
                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                                    {profile?.role === 'admin' ? 'Admin' : (profile?.role === 'teacher' ? 'Eğitmen' : 'Öğrenci')}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm ring-2 ring-white">
                                <Users size={22} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};


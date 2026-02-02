import React, { useState } from 'react';
// v1.0.1 - Fixed Outlet import and usage
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
    ClipboardList,
    BarChart3
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
            `w-full flex items-center space-x-3 px-6 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-500/5 font-black'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-bold'
            }`
        }
    >
        {({ isActive }) => (
            <>
                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                <span className="tracking-tight">{label}</span>
            </>
        )}
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
        <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-900">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Section */}
                    <div className="px-8 py-10 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                            <GraduationCap size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">Yedi Renkli</span>
                            <span className="text-[10px] font-black text-primary-500 tracking-[0.2em] uppercase mt-1">Akademi</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Ana Menü</div>
                        {profile?.role !== 'student' && (
                            <>
                                <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/" />
                                <SidebarLink icon={BarChart3} label="Analizler" to="/reports" />
                                <SidebarLink icon={BookOpen} label="Akademik Yapı" to="/academic" />
                                <SidebarLink icon={HelpCircle} label="Soru Bankası" to="/questions" />
                                <SidebarLink icon={Upload} label="Toplu Soru Yükleme" to="/questions/bulk" />
                                <SidebarLink icon={ClipboardList} label="Sınavlar" to="/exams" />
                            </>
                        )}
                        {profile?.role === 'student' && (
                            <>
                                <SidebarLink icon={LayoutDashboard} label="Genel Bakış" to="/" />
                                <SidebarLink icon={BarChart3} label="Gelişimim" to="/reports" />
                                <SidebarLink icon={ClipboardList} label="Sınavlarım" to="/student/exams" />
                                <SidebarLink icon={Trophy} label="Rozetlerim" to="/achievements" />
                            </>
                        )}

                        <div className="pt-6 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Yönetim</div>
                        {profile?.role === 'admin' && (
                            <SidebarLink icon={Users} label="Kullanıcılar" to="/users" />
                        )}
                        <SidebarLink icon={Trophy} label="Rozetler" to="/achievements" />
                        <SidebarLink icon={Settings} label="Ayarlar" to="/settings" />
                    </nav>

                    {/* Profile & Footer */}
                    <div className="p-6 border-t border-slate-50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
                        >
                            <LogOut size={20} />
                            <span className="font-bold">Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Modern Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-200"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 w-80">
                            <Search size={18} className="text-slate-400" />
                            <input type="text" placeholder="Hızlı ara..." className="bg-transparent border-none text-sm outline-none w-full font-bold placeholder:text-slate-300" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 hover:text-primary-500 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 tracking-tight">{profile?.full_name || 'Yükleniyor...'}</p>
                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-0.5">
                                    {profile ? (
                                        profile.role === 'admin' ? 'Admin' : (profile.role === 'teacher' ? 'Eğitmen' : 'Öğrenci')
                                    ) : (
                                        'Yükleniyor...'
                                    )}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm transition-all hover:border-primary-200 hover:text-primary-500">
                                <Users size={22} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};


import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@yedirenklicinar/shared-api';

// Type definitions for Supabase Auth
type User = any;
type Session = any;

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: 'admin' | 'teacher' | 'student';
    permissions: Record<string, any>;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    role: 'admin' | 'teacher' | 'student' | null;
    session: Session | null;
    loading: boolean;
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from database
    const fetchProfile = async (userId: string) => {
        try {
            console.log('=== FETCH PROFILE START ===');
            console.log('Fetching profile for user:', userId);
            console.log('Supabase client:', supabase);
            console.log('About to call supabase.from...');

            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000);
            });

            const query = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            console.log('Query created, executing...');

            // Race between query and timeout
            const result: any = await Promise.race([
                query,
                timeoutPromise
            ]);

            console.log('Query executed!');
            console.log('Supabase response:', result);

            const { data, error } = result;

            if (error) {
                console.error('Profile fetch error:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                    fullError: error
                });
                throw error;
            }
            console.log('Profile fetched successfully:', data);
            setProfile(data);
            console.log('=== FETCH PROFILE END (SUCCESS) ===');
        } catch (error: any) {
            console.error('=== FETCH PROFILE END (ERROR) ===');
            console.error('Error fetching profile (catch block):', {
                message: error?.message,
                name: error?.name,
                stack: error?.stack,
                fullError: error
            });

            // Try a simpler approach - direct fetch as fallback
            console.log('Trying direct fetch approach as fallback...');
            try {
                const response = await fetch(
                    `https://supabase.yedirenklicinar.digitalalem.com/rest/v1/profiles?id=eq.${userId}&select=*`,
                    {
                        headers: {
                            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o',
                            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o'
                        }
                    }
                );
                const data = await response.json();
                console.log('Direct fetch result:', data);
                if (data && data.length > 0) {
                    setProfile(data[0]);
                    console.log('✅ Profile set via direct fetch!');
                    return; // Success via fallback
                }
            } catch (fetchError) {
                console.error('Direct fetch also failed:', fetchError);
            }

            setProfile(null);
        }
    };

    // Initialize auth state
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
            }

            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event);

                // Set loading for significant changes if we want to ensure no flicker
                if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    setLoading(true);
                }

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setProfile(null);
                    setSession(null);
                }

                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean = false) => {
        setLoading(true);
        try {
            console.log('Attempting login for:', email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Supabase auth error:', error);
                throw error;
            }

            console.log('Login successful, user:', data.user?.id);

            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }

            setUser(data.user);
            setSession(data.session);

            if (data.user) {
                await fetchProfile(data.user.id);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            setProfile(null);
            setSession(null);
            localStorage.removeItem('rememberMe');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const refreshSession = async () => {
        try {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) throw error;

            setSession(data.session);
            setUser(data.user);
        } catch (error) {
            console.error('Session refresh error:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        profile,
        role: profile?.role ?? null,
        session,
        loading,
        login,
        logout,
        refreshSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

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
    const profileRef = React.useRef<Profile | null>(null);

    // Sync ref with state
    useEffect(() => {
        profileRef.current = profile;
    }, [profile]);

    // Fetch user profile from database
    const fetchProfile = async (userId: string, isInitial: boolean = false) => {
        // If we already have this user's profile, don't re-fetch unless it's initial load
        if (profile && profile.id === userId && !isInitial) {
            console.log('Profile already loaded for user:', userId);
            return;
        }

        try {
            console.log('=== FETCH PROFILE START ===');
            // Use a relative timeout only if we want to catch persistent hangs
            // But let's make it longer or remove it if it causes issues on slow networks
            const timeoutMs = 15000;
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs / 1000} seconds`)), timeoutMs);
            });

            const query = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Race between query and timeout
            const result: any = await Promise.race([
                query,
                timeoutPromise
            ]);

            const { data, error } = result;

            if (error) {
                console.error('Profile fetch error:', error.message);
                throw error;
            }

            if (data) {
                setProfile(data);
                console.log('Profile loaded:', data.full_name);
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error?.message);
            // Don't clear profile if it's just a timeout and we already had it
            if (error?.message?.includes('timeout') && profile && profile.id === userId) {
                console.log('Using cached profile due to timeout');
            } else {
                setProfile(null);
            }
        }
    };

    // Initialize auth state
    useEffect(() => {
        let isMounted = true;

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!isMounted) return;

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id, true);
            }

            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!isMounted) return;

                console.log('Auth state changed:', event);

                // Update auth state
                const newUser = session?.user ?? null;

                setSession(session);
                setUser(newUser);

                // Handle events
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                    if (newUser) {
                        // Only set loading if we don't have a profile OR the user changed
                        if (!profileRef.current || profileRef.current.id !== newUser.id) {
                            setLoading(true);
                        }
                        await fetchProfile(newUser.id);
                        setLoading(false);
                    }
                } else if (event === 'SIGNED_OUT') {
                    setProfile(null);
                    setLoading(false);
                }

                // Ensure loading is false after all events
                if (loading && !session?.user) {
                    setLoading(false);
                }
            }
        );

        return () => {
            isMounted = false;
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

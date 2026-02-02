import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type UserRole = 'admin' | 'teacher' | 'student';

/**
 * Hook that checks if user has required role
 * Redirects to /unauthorized if user doesn't have the required role
 */
export const useRequireRole = (allowedRoles: UserRole[]) => {
    const { role, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && role && !allowedRoles.includes(role)) {
            navigate('/unauthorized', { replace: true });
        }
    }, [role, loading, allowedRoles, navigate]);

    return { role, loading, hasAccess: role ? allowedRoles.includes(role) : false };
};

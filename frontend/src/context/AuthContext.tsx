import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { apiService, BackendStatus } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendStatus: BackendStatus;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => Promise<UserProfile>;
  switchUserRole: (newRole: UserRole) => void;
  refreshBackendStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(apiService.getBackendStatus());

  useEffect(() => {
    // Initialize session from persisted login only
    const current = storageService.getCurrentUser();
    if (current) {
      setUser(current);
    }
    setIsLoading(false);

    // Check backend health asynchronously
    apiService.checkBackendHealth().then((status) => {
      setBackendStatus(status);
    });
  }, []);

  const refreshBackendStatus = async () => {
    const status = await apiService.checkBackendHealth();
    setBackendStatus(status);
  };

  const login = async (email: string, forcedRole?: UserRole): Promise<boolean> => {
    let existing = storageService.getUserByEmail(email);
    if (!existing) {
      const assignedRole: UserRole = forcedRole || 'student';

      existing = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        role: assignedRole,
        educationLevel: 'Undergraduate',
        course: 'Computer Science',
        targetRole: 'Java Full Stack Developer',
        experienceLevel: 'Intermediate',
        weeklyHours: 12,
        preferredLearningFormat: 'Hands-on Projects',
        currentSkills: ['Java Fundamentals'],
        learningGoals: 'Career readiness',
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storageService.saveUser(existing);
    }

    setUser(existing);
    storageService.setCurrentUser(existing);
    return true;
  };

  const register = async (name: string, email: string, role: UserRole = 'student'): Promise<boolean> => {
    const existing = storageService.getUserByEmail(email);
    if (existing) {
      setUser(existing);
      storageService.setCurrentUser(existing);
      return true;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      educationLevel: '',
      course: '',
      targetRole: 'Java Full Stack Developer',
      experienceLevel: 'Beginner',
      weeklyHours: 10,
      preferredLearningFormat: 'Hands-on Projects',
      currentSkills: [],
      learningGoals: '',
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storageService.saveUser(newUser);
    setUser(newUser);
    storageService.setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    storageService.setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = async (updated: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('No authenticated user');

    const merged: UserProfile = {
      ...user,
      ...updated,
      isProfileComplete: true,
      updatedAt: new Date().toISOString()
    };

    const saved = await apiService.updateProfile(merged);
    setUser(saved);
    return saved;
  };

  const switchUserRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole, updatedAt: new Date().toISOString() };
    storageService.saveUser(updated);
    setUser(updated);
    storageService.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        backendStatus,
        login,
        register,
        logout,
        updateProfile,
        switchUserRole,
        refreshBackendStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

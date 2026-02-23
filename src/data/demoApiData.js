/**
 * Demo/Fallback API Data
 * 
 * This file contains demo data used as fallback when API endpoints are unavailable.
 * Used for development, testing, and demo purposes.
 */

export const demoLanguages = {
    status: true,
    code: 200,
    data: {
        data: [
            {
                id: 1,
                code: 'en',
                name: 'English',
                native_name: 'English',
                flag: '🇺🇸',
                is_default: true,
                is_active: true,
                direction: 'ltr',
            },
            {
                id: 2,
                code: 'ar',
                name: 'Arabic',
                native_name: 'العربية',
                flag: '🇸🇦',
                is_default: false,
                is_active: true,
                direction: 'rtl',
            },
        ],
    },
};

export const demoTranslations = {
    status: true,
    code: 200,
    data: {
        data: [
            {
                id: 1,
                key: 'dashboard',
                english: 'Dashboard',
                arabic: 'لوحة التحكم',
                category: 'navigation',
                status: 'active',
            },
            {
                id: 2,
                key: 'userManagement',
                english: 'User Management',
                arabic: 'إدارة المستخدمين',
                category: 'navigation',
                status: 'active',
            },
            {
                id: 3,
                key: 'settings',
                english: 'Settings',
                arabic: 'الإعدادات',
                category: 'navigation',
                status: 'active',
            },
            {
                id: 4,
                key: 'security',
                english: 'Security',
                arabic: 'الأمان',
                category: 'navigation',
                status: 'active',
            },
            {
                id: 5,
                key: 'save',
                english: 'Save',
                arabic: 'حفظ',
                category: 'actions',
                status: 'active',
            },
            {
                id: 6,
                key: 'cancel',
                english: 'Cancel',
                arabic: 'إلغاء',
                category: 'actions',
                status: 'active',
            },
        ],
    },
};

export const demoThemes = {
    status: true,
    code: 200,
    data: {
        data: [
            {
                id: 1,
                name: 'DEFAULT',
                label: 'Default Blue',
                primary_color: '#3B82F6',
                accent_color: '#1F2937',
                secondary_color: '#E5E7EB',
                is_dark_mode: false,
                is_active: true,
            },
            {
                id: 2,
                name: 'PURPLE',
                label: 'Royal Purple',
                primary_color: '#A855F7',
                accent_color: '#1F2937',
                secondary_color: '#F3E8FF',
                is_dark_mode: false,
                is_active: true,
            },
            {
                id: 3,
                name: 'GREEN',
                label: 'Nature Green',
                primary_color: '#10B981',
                accent_color: '#1F2937',
                secondary_color: '#D1FAE5',
                is_dark_mode: false,
                is_active: true,
            },
            {
                id: 4,
                name: 'ORANGE',
                label: 'Sunset Orange',
                primary_color: '#F97316',
                accent_color: '#1F2937',
                secondary_color: '#FFEDD5',
                is_dark_mode: false,
                is_active: true,
            },
        ],
    },
};

export const demoSettings = {
    status: true,
    code: 200,
    data: {
        data: [
            {
                id: 1,
                key: 'app_name',
                value: 'Better Dashboard',
                category: 'general',
                description: 'Application name displayed in header',
                is_public: true,
            },
            {
                id: 2,
                key: 'app_version',
                value: '1.0.0',
                category: 'general',
                description: 'Current application version',
                is_public: true,
            },
            {
                id: 3,
                key: 'maintenance_mode',
                value: 'false',
                category: 'system',
                description: 'Enable or disable maintenance mode',
                is_public: false,
            },
            {
                id: 4,
                key: 'email_notifications',
                value: 'true',
                category: 'notifications',
                description: 'Enable email notifications',
                is_public: true,
            },
        ],
    },
};

export const demoUserPreferences = {
    status: true,
    code: 200,
    data: {
        theme_preference: 'DEFAULT',
        language_preference: 'en',
        email_notifications: true,
        push_notifications: true,
        analytics: true,
        date_format: 'DD/MM/YYYY',
        time_format: '12',
        number_format: '1,234.56',
        week_start: 'monday',
    },
};

export const demoAppConfig = {
    status: true,
    code: 200,
    data: {
        app_name: 'Better Dashboard',
        version: '1.0.0',
        environment: 'demo',
        updated_at: new Date().toISOString(),
    },
};

export const demoSecurityOverview = {
    status: true,
    code: 200,
    data: {
        active_sessions: 24,
        failed_attempts: 3,
        security_score: 85,
        two_factor_enabled: '18/24',
        last_security_update: new Date().toISOString(),
    },
};

export const demoSecuritySettings = {
    status: true,
    code: 200,
    data: {
        data: [
            {
                id: 1,
                title: 'Two-Factor Authentication',
                description: 'Add an extra layer of security to admin accounts',
                enabled: true,
                key: 'two_factor_auth',
            },
            {
                id: 2,
                title: 'Session Timeout',
                description: 'Automatically log out inactive users',
                enabled: true,
                key: 'session_timeout',
            },
            {
                id: 3,
                title: 'Password Policy',
                description: 'Enforce strong password requirements',
                enabled: true,
                key: 'password_policy',
            },
            {
                id: 4,
                title: 'Login Monitoring',
                description: 'Track and monitor login attempts',
                enabled: false,
                key: 'login_monitoring',
            },
        ],
    },
};

export const demoPasswordPolicy = {
    status: true,
    code: 200,
    data: {
        minimum_length: 8,
        expiry_days: 90,
        require_uppercase: true,
        require_numbers: true,
        require_special: true,
        prevent_reuse: false,
        max_login_attempts: 5,
        lockout_duration_minutes: 15,
    },
};

export const demoSecurityLogs = {
    status: true,
    code: 200,
    data: {
        current_page: 1,
        data: [
            {
                id: 1,
                event: 'Failed Login Attempt',
                user: 'admin@example.com',
                ip_address: '192.168.1.100',
                timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
                severity: 'High',
                status: 'Blocked',
            },
            {
                id: 2,
                event: 'Password Changed',
                user: 'manager@example.com',
                ip_address: '192.168.1.101',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                severity: 'Medium',
                status: 'Success',
            },
            {
                id: 3,
                event: 'Admin Login',
                user: 'admin@example.com',
                ip_address: '192.168.1.102',
                timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
                severity: 'Low',
                status: 'Success',
            },
            {
                id: 4,
                event: '2FA Enabled',
                user: 'support@example.com',
                ip_address: '192.168.1.103',
                timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
                severity: 'Low',
                status: 'Success',
            },
            {
                id: 5,
                event: 'Suspicious Activity',
                user: 'unknown',
                ip_address: '203.0.113.50',
                timestamp: new Date(Date.now() - 34 * 60 * 60 * 1000).toISOString(),
                severity: 'High',
                status: 'Blocked',
            },
        ],
        total: 5,
    },
};

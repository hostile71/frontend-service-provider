import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useToast } from '../../contexts/ToastContext';
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { securityService } from '../../services';

const Security = () => {
  const { t } = useLocalization();
  const toast = useToast();

  // State management
  const [overview, setOverview] = useState(null);
  const [securitySettings, setSecuritySettings] = useState([]);
  const [passwordPolicy, setPasswordPolicy] = useState(null);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Password policy checkboxes state
  const [policyCheckboxes, setPolicyCheckboxes] = useState({
    requireUppercase: false,
    requireNumbers: false,
    requireSpecial: false,
    preventReuse: false,
  });

  // Fetch security overview on component mount
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await securityService.getOverview();
        setOverview(response.data);
      } catch (err) {
        console.error('Error fetching security overview:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  // Fetch security settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await securityService.getSettings();
        setSecuritySettings(response.data.data || []);
      } catch (err) {
        console.error('Error fetching security settings:', err);
      }
    };

    fetchSettings();
  }, []);

  // Fetch password policy
  useEffect(() => {
    const fetchPasswordPolicy = async () => {
      try {
        const response = await securityService.getPasswordPolicy();
        setPasswordPolicy(response.data);
        // Populate checkbox state from policy
        setPolicyCheckboxes({
          requireUppercase: response.data?.requireUppercase ?? response.data?.require_uppercase ?? false,
          requireNumbers: response.data?.requireNumbers ?? response.data?.require_numbers ?? false,
          requireSpecial: response.data?.requireSpecial ?? response.data?.require_special ?? false,
          preventReuse: response.data?.preventReuse ?? response.data?.prevent_reuse ?? false,
        });
      } catch (err) {
        console.error('Error fetching password policy:', err);
      }
    };

    fetchPasswordPolicy();
  }, []);

  // Fetch security logs with pagination
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await securityService.getLogs({ page });
        setSecurityLogs(response.data.data || response.data || []);
      } catch (err) {
        console.error('Error fetching security logs:', err);
      }
    };

    fetchLogs();
  }, [page]);

  const handleSettingToggle = async (settingId, currentValue) => {
    try {
      const response = await securityService.updateSetting(settingId, {
        enabled: !currentValue
      });

      // Update local state
      setSecuritySettings(
        securitySettings.map(s =>
          s.id === settingId ? { ...s, enabled: !currentValue } : s
        )
      );

      // Show success toast
      const successMsg = response?.message || 'Security setting updated successfully!';
      toast.success(successMsg);
    } catch (err) {
      console.error('Error updating setting:', err);
      const errorMsg = err.message || 'Failed to update security setting';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleSavePasswordPolicy = async () => {
    try {
      setSaving(true);
      setError(null);

      const policyPayload = {
        ...passwordPolicy,
        require_uppercase: policyCheckboxes.requireUppercase,
        require_numbers: policyCheckboxes.requireNumbers,
        require_special: policyCheckboxes.requireSpecial,
        prevent_reuse: policyCheckboxes.preventReuse,
      };

      const response = await securityService.updatePasswordPolicy(policyPayload);

      // Show success toast
      const successMsg = response?.message || 'Password policy updated successfully!';
      toast.success(successMsg);
    } catch (err) {
      console.error('Error saving password policy:', err);
      const errorMsg = err.message || 'Failed to update password policy';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // Fallback data if API fails
  const defaultSecuritySettings = [
    {
      id: 1,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to admin accounts',
      enabled: true,
      icon: Shield
    },
    {
      id: 2,
      title: 'Session Timeout',
      description: 'Automatically log out inactive users',
      enabled: true,
      icon: Lock
    },
    {
      id: 3,
      title: 'Password Policy',
      description: 'Enforce strong password requirements',
      enabled: true,
      icon: Key
    },
    {
      id: 4,
      title: 'Login Monitoring',
      description: 'Track and monitor login attempts',
      enabled: false,
      icon: Eye
    }
  ];

  // Fetch security settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await securityService.getSettings();
        const settings = response.data.data || [];
        // If settings exist, use them; otherwise use default settings as fallback
        setSecuritySettings(settings.length > 0 ? settings : defaultSecuritySettings);
      } catch (err) {
        console.error('Error fetching security settings:', err);
        // On error, use default settings
        setSecuritySettings(defaultSecuritySettings);
      }
    };

    fetchSettings();
  }, []);

  const settingsToDisplay = securitySettings.length > 0 ? securitySettings : defaultSecuritySettings;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('security') || 'Security'}</h1>
        <p className="text-gray-600">
          Manage system security settings, monitor threats, and configure access controls.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading security data...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{overview?.activeSessions || overview?.active_sessions || '24'}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{overview?.failedAttempts || overview?.failed_attempts || '3'}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Score</p>
                  <p className="text-2xl font-bold text-gray-900">{overview?.securityScore || overview?.security_score || '85'}%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
                  <p className="text-2xl font-bold text-gray-900">{overview?.twoFactorEnabled || overview?.two_factor_enabled || '18/24'}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Key className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <div className="space-y-4">
              {settingsToDisplay.map((setting) => {
                const Icon = setting.icon || Eye;
                return (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{setting.title}</h3>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${setting.enabled ? 'text-green-600' : 'text-gray-600'}`}>
                        {setting.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button
                        onClick={() => handleSettingToggle(setting.id, setting.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Password Policy */}
          {/* <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Password Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Length
                </label>
                <input
                  type="number"
                  value={passwordPolicy?.minimumLength || passwordPolicy?.minimum_length || '8'}
                  onChange={(e) => setPasswordPolicy({
                    ...passwordPolicy,
                    minimumLength: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={passwordPolicy?.expiryDays || passwordPolicy?.expiry_days || '90'}
                  onChange={(e) => setPasswordPolicy({
                    ...passwordPolicy,
                    expiryDays: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="uppercase"
                  className="rounded"
                  checked={policyCheckboxes.requireUppercase}
                  onChange={(e) => setPolicyCheckboxes({
                    ...policyCheckboxes,
                    requireUppercase: e.target.checked
                  })}
                />
                <label htmlFor="uppercase" className="text-sm text-gray-700">Require uppercase letters</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="numbers"
                  className="rounded"
                  checked={policyCheckboxes.requireNumbers}
                  onChange={(e) => setPolicyCheckboxes({
                    ...policyCheckboxes,
                    requireNumbers: e.target.checked
                  })}
                />
                <label htmlFor="numbers" className="text-sm text-gray-700">Require numbers</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="special"
                  className="rounded"
                  checked={policyCheckboxes.requireSpecial}
                  onChange={(e) => setPolicyCheckboxes({
                    ...policyCheckboxes,
                    requireSpecial: e.target.checked
                  })}
                />
                <label htmlFor="special" className="text-sm text-gray-700">Require special characters</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="history"
                  className="rounded"
                  checked={policyCheckboxes.preventReuse}
                  onChange={(e) => setPolicyCheckboxes({
                    ...policyCheckboxes,
                    preventReuse: e.target.checked
                  })}
                />
                <label htmlFor="history" className="text-sm text-gray-700">Prevent password reuse</label>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleSavePasswordPolicy}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Update Policy'}
              </button>
            </div>
          </div> */}

          {/* Security Logs */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Security Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {securityLogs.length > 0 ? (
                    securityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{log.event}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.user || log.user_email}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{log.ip_address || log.ip}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date(log.timestamp || log.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${log.severity === 'High' ? 'bg-red-100 text-red-800' :
                            log.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${log.status === 'Success' ? 'bg-green-100 text-green-800' :
                            log.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                            {log.status === 'Success' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                              log.status === 'Blocked' ? <AlertTriangle className="w-3 h-3 mr-1" /> : null}
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        No security logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Security;

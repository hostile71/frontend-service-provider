import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

const Security = () => {
  const { t } = useLocalization();

  const securitySettings = [
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to admin accounts',
      enabled: true,
      icon: Shield
    },
    {
      title: 'Session Timeout',
      description: 'Automatically log out inactive users',
      enabled: true,
      icon: Lock
    },
    {
      title: 'Password Policy',
      description: 'Enforce strong password requirements',
      enabled: true,
      icon: Key
    },
    {
      title: 'Login Monitoring',
      description: 'Track and monitor login attempts',
      enabled: false,
      icon: Eye
    }
  ];

  const securityLogs = [
    {
      id: 1,
      event: 'Failed Login Attempt',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      timestamp: '2024-08-18 14:30:25',
      severity: 'High',
      status: 'Blocked'
    },
    {
      id: 2,
      event: 'Password Changed',
      user: 'manager@example.com',
      ip: '192.168.1.101',
      timestamp: '2024-08-18 10:15:10',
      severity: 'Medium',
      status: 'Success'
    },
    {
      id: 3,
      event: 'Admin Login',
      user: 'admin@example.com',
      ip: '192.168.1.102',
      timestamp: '2024-08-18 09:00:00',
      severity: 'Low',
      status: 'Success'
    },
    {
      id: 4,
      event: '2FA Enabled',
      user: 'support@example.com',
      ip: '192.168.1.103',
      timestamp: '2024-08-17 16:45:30',
      severity: 'Low',
      status: 'Success'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('security')}</h1>
        <p className="text-gray-600">
          Manage system security settings, monitor threats, and configure access controls.
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
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
              <p className="text-2xl font-bold text-gray-900">3</p>
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
              <p className="text-2xl font-bold text-gray-900">85%</p>
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
              <p className="text-2xl font-bold text-gray-900">18/24</p>
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
          {securitySettings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
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
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      setting.enabled ? 'bg-theme-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-6' : 'translate-x-1'
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
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Password Policy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Length
            </label>
            <input 
              type="number" 
              value="8" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (days)
            </label>
            <input 
              type="number" 
              value="90" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="uppercase" className="rounded" defaultChecked />
            <label htmlFor="uppercase" className="text-sm text-gray-700">Require uppercase letters</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="numbers" className="rounded" defaultChecked />
            <label htmlFor="numbers" className="text-sm text-gray-700">Require numbers</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="special" className="rounded" defaultChecked />
            <label htmlFor="special" className="text-sm text-gray-700">Require special characters</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="history" className="rounded" />
            <label htmlFor="history" className="text-sm text-gray-700">Prevent password reuse</label>
          </div>
        </div>
        <div className="mt-6">
          <button className="px-6 py-2 btn-theme-primary rounded-lg">
            Update Policy
          </button>
        </div>
      </div>

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
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{log.event}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{log.user}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{log.ip}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{log.timestamp}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      log.severity === 'High' ? 'bg-red-100 text-red-800' :
                      log.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === 'Success' ? 'bg-green-100 text-green-800' :
                      log.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status === 'Success' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
                       log.status === 'Blocked' ? <AlertTriangle className="w-3 h-3 mr-1" /> : null}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Security;

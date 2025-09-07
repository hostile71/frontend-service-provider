import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import Modal from './Modal';

const ProfileSettingsModal = ({ isOpen, onClose }) => {
  const { t } = useLocalization();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('profileSettings')}>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
          <input 
            type="text" 
            defaultValue="Rabius Sani" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg form-input-theme"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
          <input 
            type="email" 
            defaultValue="admin@serviceapp.com" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
          <input 
            type="tel" 
            defaultValue="+968 77057472" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('currentPassword')}</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('newPassword')}</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('confirmPassword')}</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit"
            className="px-4 py-2 btn-theme-primary rounded-lg"
          >
            {t('updateProfile')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileSettingsModal;

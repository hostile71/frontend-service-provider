import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import DataTable from '../ui/DataTable';

const ServiceRequests = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  // Mock data for service requests
  const mockServiceRequests = [
    {
      id: 1,
      customer: 'Ahmed Al-Rashid',
      service: 'AC Repair',
      provider: 'TechCare Services',
      requestDate: '2024-08-18',
      urgency: 'High',
      status: 'pending',
      location: 'Muscat',
      estimatedCost: 45,
      description: 'Air conditioning unit not cooling properly'
    },
    {
      id: 2,
      customer: 'Sarah Mohammed',
      service: 'House Cleaning',
      provider: 'CleanPro',
      requestDate: '2024-08-17',
      urgency: 'Medium',
      status: 'inProgress',
      location: 'Salalah',
      estimatedCost: 30,
      description: 'Deep cleaning for 3-bedroom apartment'
    },
    {
      id: 3,
      customer: 'Omar Hassan',
      service: 'Plumbing',
      provider: 'Fix-It-Fast',
      requestDate: '2024-08-16',
      urgency: 'High',
      status: 'completed',
      location: 'Nizwa',
      estimatedCost: 60,
      description: 'Kitchen sink pipe leakage repair'
    },
    {
      id: 4,
      customer: 'Fatima Al-Balushi',
      service: 'Electrical Work',
      provider: 'PowerTech',
      requestDate: '2024-08-15',
      urgency: 'Low',
      status: 'pending',
      location: 'Sohar',
      estimatedCost: 25,
      description: 'Install new light fixtures in living room'
    }
  ];

  const handleAddRequest = () => {
    setModalType('service-request');
    setShowModal(true);
  };

  const requestColumns = [
    t('customer'),
    'Service',
    t('provider'),
    'Request Date',
    'Urgency',
    t('status'),
    'Location',
    'Estimated Cost',
    t('description')
  ];

  return (
    <DataTable
      data={mockServiceRequests}
      columns={requestColumns}
      title={t('serviceRequests')}
      onAdd={handleAddRequest}
      searchFields={['customer', 'service', 'provider', 'location', 'description']}
      itemType="service-request"
    />
  );
};

export default ServiceRequests;

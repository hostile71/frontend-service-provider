import React from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { getStatusConfig } from '../../utils/helpers';
import { useLocalization } from '../../contexts/LocalizationContext';

const StatusBadge = ({ status }) => {
  const { isRTL } = useLocalization();
  
  const statusIcons = {
    active: CheckCircle,
    inactive: XCircle,
    pending: Clock,
    inProgress: RefreshCw,
    completed: CheckCircle,
    cancelled: XCircle,
  };
  
  const config = getStatusConfig(status);
  const IconComponent = statusIcons[status] || AlertCircle;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <IconComponent className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
      {status}
    </span>
  );
};

export default StatusBadge;

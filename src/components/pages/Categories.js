import React from 'react';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppContext } from '../../contexts/AppContext';
import { mockCategories } from '../../data/mockData';
import DataTable from '../ui/DataTable';

const Categories = () => {
  const { t } = useLocalization();
  const { setModalType, setShowModal } = useAppContext();

  const handleAddCategory = () => {
    setModalType('category');
    setShowModal(true);
  };

  const categoryColumns = [
    t('name'), 
    'Service Count', 
    t('status'), 
    t('description')
  ];

  return (
    <DataTable
      data={mockCategories}
      columns={categoryColumns}
      title={t('categories')}
      onAdd={handleAddCategory}
      searchFields={['name', 'nameAr', 'description']}
      itemType="category"
    />
  );
};

export default Categories;

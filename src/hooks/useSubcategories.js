import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subcategoryService } from '../services';

export const subcategoryKeys = {
  all: ['subcategories'],
  lists: () => [...subcategoryKeys.all, 'list'],
  list: (params) => [...subcategoryKeys.lists(), { params }],
  details: () => [...subcategoryKeys.all, 'detail'],
  detail: (id) => [...subcategoryKeys.details(), id],
};

export const useSubcategories = (params = {}) => {
  return useQuery({
    queryKey: subcategoryKeys.list(params),
    queryFn: () => subcategoryService.getAll(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previous) => previous,
    enabled: true,
  });
};

export const useSubcategory = (id) => {
  return useQuery({
    queryKey: subcategoryKeys.detail(id),
    queryFn: () => subcategoryService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => subcategoryService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subcategoryKeys.lists() }),
  });
};

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => subcategoryService.update(id, data),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: subcategoryKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: subcategoryKeys.lists() });
    },
  });
};

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => subcategoryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subcategoryKeys.lists() }),
  });
};

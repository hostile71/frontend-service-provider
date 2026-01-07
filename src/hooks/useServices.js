import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services';

export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  list: (params) => [...serviceKeys.lists(), { params }],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (id) => [...serviceKeys.details(), id],
};

export const useServices = (params = {}) => {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => serviceService.getAll(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previous) => previous,
    enabled: true,
  });
};

export const useService = (id) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => serviceService.getById(id),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => serviceService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.lists() }),
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => serviceService.update(id, data),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => serviceService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: serviceKeys.lists() }),
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionService } from '../services';

export const promotionKeys = {
  all: ['promotions'],
  lists: () => [...promotionKeys.all, 'list'],
  list: (params) => [...promotionKeys.lists(), { params }],
  details: () => [...promotionKeys.all, 'detail'],
  detail: (id) => [...promotionKeys.details(), id],
};

export const usePromotions = (params = {}) => {
  return useQuery({
    queryKey: promotionKeys.list(params),
    queryFn: () => promotionService.getAll(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previous) => previous,
    enabled: true,
  });
};

export const usePromotion = (id) => {
  return useQuery({
    queryKey: promotionKeys.detail(id),
    queryFn: () => promotionService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => promotionService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promotionKeys.lists() }),
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => promotionService.update(id, data),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: promotionKeys.lists() });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => promotionService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promotionKeys.lists() }),
  });
};

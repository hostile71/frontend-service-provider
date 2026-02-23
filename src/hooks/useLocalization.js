/**
 * Localization React Query Hooks
 * 
 * Custom hooks for managing translations and languages
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localizationService } from '../services';

// Query keys for translations
export const translationKeys = {
    all: ['translations'],
    lists: () => [...translationKeys.all, 'list'],
    list: (params) => [...translationKeys.lists(), { params }],
    details: () => [...translationKeys.all, 'detail'],
    detail: (id) => [...translationKeys.details(), id],
};

/**
 * Hook to delete a translation
 * @returns {Object} Mutation object
 */
export const useDeleteTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => localizationService.deleteTranslation(id),
        onSuccess: () => {
            // Invalidate translations list
            queryClient.invalidateQueries({ queryKey: ['translations'] });
        },
    });
};

/**
 * Hook to update a translation
 * @returns {Object} Mutation object
 */
export const useUpdateTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => localizationService.updateTranslation(id, data),
        onSuccess: () => {
            // Invalidate translations list
            queryClient.invalidateQueries({ queryKey: ['translations'] });
        },
    });
};

/**
 * Hook to create a translation
 * @returns {Object} Mutation object
 */
export const useCreateTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => localizationService.createTranslation(data),
        onSuccess: () => {
            // Invalidate translations list
            queryClient.invalidateQueries({ queryKey: ['translations'] });
        },
    });
};

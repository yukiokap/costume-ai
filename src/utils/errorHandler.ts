export type ErrorType = 'api_key' | 'quota' | 'safety' | 'network' | 'unknown';

export interface AppError {
    message: string;
    type: ErrorType;
}

export const getAppError = (error: unknown, t: (key: string) => string): AppError => {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('400') || message.includes('API key not valid') || message.includes('INVALID_ARGUMENT')) {
        return { message: t('results.errors.api_key_invalid'), type: 'api_key' };
    }
    if (message.includes('429') || message.includes('quota')) {
        return { message: t('results.errors.quota_exceeded'), type: 'quota' };
    }
    if (message.includes('SAFETY') || message.includes('blocked')) {
        return { message: t('results.errors.safety_block'), type: 'safety' };
    }
    if (message.includes('fetch') || message.includes('network')) {
        return { message: t('results.errors.network_error'), type: 'network' };
    }

    return { message: `${t('results.errors.unknown')} ${message}`, type: 'unknown' };
};

// For backward compatibility if needed, but we should use getAppError
export const getErrorMessage = (error: unknown, t: (key: string) => string): string => {
    return getAppError(error, t).message;
};

import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;

    interface SnapResponse {
        order_id: string;
        transaction_status: string;
        payment_type: string;
        gross_amount: string;
        [key: string]: unknown;
    }

    interface Snap {
        pay: (
            snapToken: string,
            options: {
                onSuccess?: (result: SnapResponse) => void;
                onPending?: (result: SnapResponse) => void;
                onError?: (result: SnapResponse) => void;
                onClose?: () => void;
            },
        ) => void;
    }

    interface Window {
        snap: Snap;
    }
}


declare module 'react-paystack' {
    export interface PaystackProps {
        publicKey: string;
        email: string;
        amount: number;
        reference?: string;
        metadata?: any;
        currency?: string;
        channels?: string[];
        label?: string;
        plan?: string;
        quantity?: number;
        subaccount?: string;
        transaction_charge?: number;
        bearer?: string;
    }

    export function usePaystackPayment(config: PaystackProps): (callback: { onSuccess?: (reference: any) => void, onClose?: () => void }) => void;
    export const PaystackButton: React.ComponentType<any>;
    export const PaystackConsumer: React.ComponentType<any>;
}

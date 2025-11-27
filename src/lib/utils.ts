import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

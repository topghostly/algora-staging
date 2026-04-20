/**
 * Utility to retry a database operation with exponential backoff.
 * Only retries on specific connection-related errors.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 500, // ms
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Prisma Errors to retry:
      // P1001: Can't reach database server
      // P1002: The database server was reached but timed out
      // P1008: Operations timed out
      // P1011: Error at establishing a TLS connection
      const connectionErrorCodes = ["P1001", "P1002", "P1008", "P1011"];
      
      const isTransientError = 
        connectionErrorCodes.includes(error?.code) ||
        error?.message?.includes("Can't reach database server") ||
        error?.message?.includes("timed out");

      if (!isTransientError || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = initialDelay * Math.pow(2, attempt);
      console.warn(`Database connection error (${error?.code}). Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

import { useEffect, useState } from "react";
import type { FormValidationSchema } from "../types/formValidation";

export const useValidationRules = () => {
    const [data, setData] = useState<FormValidationSchema | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchValidationRules(signal: AbortSignal) {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/loans/validation-rules", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = (await response.json()) as FormValidationSchema;
                setData(json);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Failed to load validation rules");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchValidationRules(controller.signal);

        return () => controller.abort();
    }, []);

    return { data, loading, error };
}
import { Box, Button, MenuItem, Paper, TextField, Typography, CircularProgress, Alert } from "@mui/material";
import { type FC, useState } from "react";
import { LoanFormHeader } from "../LoanFormHeader/LoanFormHeader";
import type { EmploymentStatus, LoanEligibilityResponse } from "../../types/loanEligibility";
import type { FormValidationSchema, LoanApplicationForm } from "../../types/formValidation";
import { Controller, useForm } from "react-hook-form";
import "./LoanForm.css";
import { capitalizeFirst } from "../../utils/formHelper";
import LoanEligibilityResult from "../LoanEligibilityResult/LoanEligibilityResult";

const employmentStatusOptions: EmploymentStatus[] = [
    "employed",
    "self_employed",
    "unemployed",
    "retired"
];

interface LoanFormProps {
    validationRules: FormValidationSchema
}

export const LoanForm: FC<LoanFormProps> = ({ validationRules }) => {
    const { handleSubmit, formState: { errors }, control } = useForm<LoanApplicationForm>(
        {
            defaultValues: {
                personalInfo: {
                    age: null,
                    employmentStatus: "",
                    employmentDuration: null,
                },
                financialInfo: {
                    monthlyIncome: null,
                    monthlyExpenses: null,
                    creditScore: null,
                },
                loanDetails: {
                    requestedAmount: null,
                    loanTerm: null,
                },

            },
            mode: "onBlur"
        },
    );
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | LoanEligibilityResponse>(null);
    const [backendError, setBackendError] = useState<null | string>(null);

    const onSubmit = async (data: LoanApplicationForm) => {
        setLoading(true);
        setResult(null);
        setBackendError(null);
        try {
            const resp = await fetch("/api/loans/eligibility", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (!resp.ok) {
                let errMsg = "Submission failed.";
                try {
                    const errJson = await resp.json();
                    if (errJson && errJson.error) {
                        errMsg = errJson.error;
                    }
                } catch (e) {
                }
                setBackendError(errMsg);
            } else {
                const json: LoanEligibilityResponse = await resp.json();
                setResult({
                    eligibilityResult: json.eligibilityResult,
                    recommendedLoan: json.recommendedLoan,
                    affordabilityAnalysis: json.affordabilityAnalysis,
                });
            }
        } catch (e: any) {
            setBackendError("Network error: " + (e?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Paper className="calculator-container" elevation={3}>
            <LoanFormHeader variant="h5" title="Loan Eligibility Calculator" />
            {backendError && (
                <Box mb={2}>
                    <Alert severity="error">{backendError}</Alert>
                </Box>
            )}
            <form className="calculator-form" onSubmit={handleSubmit(onSubmit)}>
                <Box mb={3}>
                    <Typography variant="subtitle1">Personal Info</Typography>
                    <Controller
                        name="personalInfo.age"
                        control={control}
                        rules={{
                            required: validationRules.personalInfo.age.required ? validationRules.personalInfo.age.errorMessage : false,
                            min: validationRules.personalInfo.age.min !== undefined ? { value: validationRules.personalInfo.age.min, message: validationRules.personalInfo.age.errorMessage } : undefined,
                            max: validationRules.personalInfo.age.max !== undefined ? { value: validationRules.personalInfo.age.max, message: validationRules.personalInfo.age.errorMessage } : undefined,
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === '' ? null : Number(v));
                                }}
                                label="Age"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.personalInfo?.age}
                                helperText={errors.personalInfo?.age?.message}
                            />
                        )}
                    />

                    <Controller
                        name="personalInfo.employmentDuration"
                        control={control}
                        rules={{
                            required: validationRules.personalInfo.employmentDuration.required ? validationRules.personalInfo.employmentDuration.errorMessage : false,
                            min: validationRules.personalInfo.employmentDuration.min !== undefined ? { value: validationRules.personalInfo.employmentDuration.min, message: validationRules.personalInfo.employmentDuration.errorMessage } : undefined,
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === '' ? null : Number(v));
                                }}
                                label="Employment Duration (months)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.personalInfo?.employmentDuration}
                                helperText={errors.personalInfo?.employmentDuration?.message}
                            />
                        )}
                    />

                    <Controller
                        name="personalInfo.employmentStatus"
                        control={control}
                        rules={{
                            required: validationRules.personalInfo.employmentStatus.required
                                ? validationRules.personalInfo.employmentStatus.errorMessage
                                : false,
                            validate: (value) =>
                                (validationRules.personalInfo.employmentStatus.options ?? []).includes(value as EmploymentStatus) ||
                                validationRules.personalInfo.employmentStatus.errorMessage
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Employment Status"
                                select
                                fullWidth
                                margin="normal"
                                error={!!errors.personalInfo?.employmentStatus}
                                helperText={errors.personalInfo?.employmentStatus?.message}
                            >
                                {employmentStatusOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {capitalizeFirst(option.replace("_", " "))}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Box>
                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Financial Info
                    </Typography>

                    <Controller
                        name="financialInfo.monthlyIncome"
                        control={control}
                        rules={{
                            required: validationRules.financialInfo.monthlyIncome.required
                                ? validationRules.financialInfo.monthlyIncome.errorMessage
                                : false,
                            min: validationRules.financialInfo.monthlyIncome.min !== undefined ? {
                                value: validationRules.financialInfo.monthlyIncome.min,
                                message: validationRules.financialInfo.monthlyIncome.errorMessage
                            } : undefined
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === '' ? null : Number(v));
                                }}
                                label="Monthly Income (R)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.financialInfo?.monthlyIncome}
                                helperText={errors.financialInfo?.monthlyIncome?.message}
                            />
                        )}
                    />

                    <Controller
                        name="financialInfo.monthlyExpenses"
                        control={control}
                        rules={{
                            required: validationRules.financialInfo.monthlyExpenses.required
                                ? validationRules.financialInfo.monthlyExpenses.errorMessage
                                : false,
                            min: validationRules.financialInfo.monthlyExpenses.min !== undefined ? {
                                value: validationRules.financialInfo.monthlyExpenses.min,
                                message: validationRules.financialInfo.monthlyExpenses.errorMessage
                            } : undefined
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === '' ? null : Number(v));
                                }}
                                label="Monthly Expenses (R)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.financialInfo?.monthlyExpenses}
                                helperText={errors.financialInfo?.monthlyExpenses?.message}
                            />
                        )}
                    />

                    <Controller
                        name="financialInfo.creditScore"
                        control={control}
                        rules={{
                            required: validationRules.financialInfo.creditScore.required
                                ? validationRules.financialInfo.creditScore.errorMessage
                                : false,
                            min: validationRules.financialInfo.creditScore.min && {
                                value: validationRules.financialInfo.creditScore.min,
                                message: validationRules.financialInfo.creditScore.errorMessage
                            },
                            max: validationRules.financialInfo.creditScore.max && {
                                value: validationRules.financialInfo.creditScore.max,
                                message: validationRules.financialInfo.creditScore.errorMessage
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === '' ? null : Number(v));
                                }}
                                label="Credit Score (Optional)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.financialInfo?.creditScore}
                                helperText={errors.financialInfo?.creditScore?.message}
                            />
                        )}
                    />
                </Box>

                <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Loan Details
                    </Typography>

                    <Controller
                        name="loanDetails.requestedAmount"
                        control={control}
                        rules={{
                            required: validationRules.loanDetails.requestedAmount.required
                                ? validationRules.loanDetails.requestedAmount.errorMessage
                                : false,
                            min: validationRules.loanDetails.requestedAmount.min !== undefined ? {
                                value: validationRules.loanDetails.requestedAmount.min,
                                message: validationRules.loanDetails.requestedAmount.errorMessage
                            } : undefined,
                            max: validationRules.loanDetails.requestedAmount.max !== undefined ? {
                                value: validationRules.loanDetails.requestedAmount.max,
                                message: validationRules.loanDetails.requestedAmount.errorMessage
                            } : undefined
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === '' ? null : Number(v));
                                }}
                                label="Requested Amount (R)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.loanDetails?.requestedAmount}
                                helperText={errors.loanDetails?.requestedAmount?.message}
                            />
                        )}
                    />

                    <Controller
                        name="loanDetails.loanTerm"
                        control={control}
                        rules={{
                            required: validationRules.loanDetails.loanTerm.required
                                ? validationRules.loanDetails.loanTerm.errorMessage
                                : false,
                            min: validationRules.loanDetails.loanTerm.min !== undefined ? {
                                value: validationRules.loanDetails.loanTerm.min,
                                message: validationRules.loanDetails.loanTerm.errorMessage
                            } : undefined,
                            max: validationRules.loanDetails.loanTerm.max !== undefined ? {
                                value: validationRules.loanDetails.loanTerm.max,
                                message: validationRules.loanDetails.loanTerm.errorMessage
                            } : undefined
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    field.onChange(v === '' ? null : Number(v));
                                }}
                                label="Loan Term (months)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={!!errors.loanDetails?.loanTerm}
                                helperText={errors.loanDetails?.loanTerm?.message}
                            />
                        )}
                    />
                </Box>
                <Box mt={2} display="flex" alignItems="center">
                    <Button variant="contained" color="primary" type="submit" disabled={loading || !!result}>
                        {loading ? (
                            <>
                                <CircularProgress size={22} color="inherit" style={{ marginRight: 8 }} />
                                Checking...
                            </>
                        ) : (
                            "Check Eligibility"
                        )}
                    </Button>
                </Box>
                {
                    result && <LoanEligibilityResult result={result} />
                }
            </form>
        </Paper>
    );
};
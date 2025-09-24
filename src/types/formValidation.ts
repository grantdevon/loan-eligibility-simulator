import type { EmploymentStatus } from "./loanEligibility";

export interface ValidationRules<T = any> {
    min?: number;
    max?: number;
    required: boolean;
    options?: readonly T[];
    errorMessage: string;
}

export interface PersonalInfoValidation {
    age: ValidationRules<number>;
    employmentStatus: ValidationRules<EmploymentStatus>;
    employmentDuration: ValidationRules<number>;
}

export interface FinancialInfoValidation {
    monthlyIncome: ValidationRules<number>;
    monthlyExpenses: ValidationRules<number>;
    creditScore: ValidationRules<number>;
}

export interface LoanDetailsValidation {
    requestedAmount: ValidationRules<number>;
    loanTerm: ValidationRules<number>;
}

export interface FormValidationSchema {
    personalInfo: PersonalInfoValidation;
    financialInfo: FinancialInfoValidation;
    loanDetails: LoanDetailsValidation;
}

/**
 * Top is used for rules about the form
 * 
 * Bottom is used for the actual form data
 */

export interface PersonalInfoForm {
    age: number;
    employmentStatus: EmploymentStatus;
    employmentDuration: number;
}

export interface FinancialInfoForm {
    monthlyIncome: number;
    monthlyExpenses: number;
    creditScore: number;
}

export interface LoanDetailsForm {
    requestedAmount: number;
    loanTerm: number;
}
export type LoanApplicationForm = {
    personalInfo: PersonalInfoForm;
    financialInfo: FinancialInfoForm;
    loanDetails: LoanDetailsForm;
}
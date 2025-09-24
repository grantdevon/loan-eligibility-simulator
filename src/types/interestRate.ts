export type LoanType = "personal_loan" | "vehicle_loan" | string;

export interface InterestRateCalculationRequest {
    loanAmount: number;
    loanTerm: number;
    creditScore: number;
    loanType: LoanType;
}

export interface PaymentSchedule {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

export interface InterestRateCalculationResponse {
    interestRate: number;
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
    paymentSchedule: PaymentSchedule[];
}
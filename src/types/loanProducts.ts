export type InterestRateRange = {
    min: number;
    max: number
}

export type LoanPurpose = "debt_consolidation" | "home_improvement" | "education" | "medical" | "other" | "new_vehicle" | "used_vehicle";

export interface LoanProduct {
    id: string;
    name: string;
    description: string;
    minAmount: number;
    maxAmount: number;
    minTerm: number;
    maxTerm: number;
    interestRateRange: InterestRateRange;
    purposes: LoanPurpose[]
}

export interface LoanProductsResponse {
    products: LoanProduct[];
}
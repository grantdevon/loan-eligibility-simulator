import { Typography, type TypographyPropsVariantOverrides, type TypographyVariant } from "@mui/material";
import type { OverridableStringUnion } from "@mui/types";
import type { FC } from "react";


/**
 * Can expand on this component later with more props as needed
 * 
 * Will keep consistent header styles across the app
 */

export interface LoanFormHeaderProps {
    variant: OverridableStringUnion<TypographyVariant | 'inherit', TypographyPropsVariantOverrides>,
    title: string;
    gutterBottom?: boolean;
}

export const LoanFormHeader: FC<LoanFormHeaderProps> = ({ title, variant, gutterBottom = true }) => (
    <Typography variant={variant} gutterBottom={gutterBottom}>{title}</Typography>
);
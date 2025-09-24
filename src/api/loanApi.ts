const BASE_URL = '/api/loans';

export const checkEligibility = async (payload: any) => {
	const res = await fetch(`${BASE_URL}/eligibility`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	return res.json();
};

export const getLoanProducts = async () => {
	const res = await fetch(`${BASE_URL}/products`);
	return res.json();
};

export const calculateRate = async (payload: any) => {
	const res = await fetch(`${BASE_URL}/calculate-rate`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	return res.json();
};

export const getValidationRules = async () => {
	const res = await fetch(`${BASE_URL}/validation-rules`);
	return res.json();
};

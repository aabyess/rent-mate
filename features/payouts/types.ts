// features/payouts/types.ts

export type PartnerPayoutAccount = {
	partner_id: string;
	bank_name: string;
	account_holder: string;
	account_number: string;
	updated_at: string;
};

export type UpsertPayoutAccountInput = {
	bankName: string;
	accountHolder: string;
	accountNumber: string;
};

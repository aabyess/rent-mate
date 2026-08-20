// features/preferences/types.ts

export type CustomerPreferences = {
	profile_id: string;
	interests: string[];
	regions: string[];
	purposes: string[];
	skipped_at: string | null;
	updated_at: string;
};

export type SavePreferencesInput = {
	interests: string[];
	regions: string[];
	purposes: string[];
};

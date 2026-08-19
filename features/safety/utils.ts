// features/safety/utils.ts

export function formatDateShort(isoDate: string): string {
	const date = new Date(isoDate);
	return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

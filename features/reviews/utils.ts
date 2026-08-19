// features/reviews/utils.ts

export function formatReviewDate(createdAt: string): string {
	const date = new Date(createdAt);
	return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

export function calculateAverageRating(ratings: number[]): number {
	if (ratings.length === 0) {
		return 0;
	}
	const sum = ratings.reduce(function (total, rating) {
		return total + rating;
	}, 0);
	return Math.round((sum / ratings.length) * 10) / 10;
}

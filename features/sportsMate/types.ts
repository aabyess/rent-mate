// features/sportsMate/types.ts

export type SportsMateTimeSlot = "morning" | "afternoon" | "evening" | "anytime";

export type SportsMateGenderMode = "same_gender" | "any";

export type SportsMatePostStatus = "open" | "matched" | "closed";

export type SportsMatePost = {
	id: string;
	author_id: string;
	author_name: string;
	sport: string;
	region: string;
	preferred_date: string;
	time_slot: SportsMateTimeSlot;
	gender_mode: SportsMateGenderMode;
	comment: string;
	status: SportsMatePostStatus;
	created_at: string;
};

export type SportsMatePostInput = {
	sport: string;
	region: string;
	preferredDate: string;
	timeSlot: SportsMateTimeSlot;
	genderMode: SportsMateGenderMode;
	comment: string;
};

// matched는 2단계 수락 로직 몫이라 앱에서 세팅 가능한 값은 closed뿐이다
export type PatchSportsMatePostStatusInput = {
	postId: string;
	status: "closed";
};

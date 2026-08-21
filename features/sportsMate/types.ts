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

// matched는 accept_sports_mate_request RPC 몫이라 앱에서 직접 세팅 가능한 값은 closed뿐이다
export type PatchSportsMatePostStatusInput = {
	postId: string;
	status: "closed";
};

export type SportsMateRequestStatus = "pending" | "accepted" | "declined" | "cancelled";

export type SportsMateRequest = {
	id: string;
	post_id: string;
	requester_id: string;
	requester_name: string;
	status: SportsMateRequestStatus;
	created_at: string;
};

// 신청자 쪽 "내 신청" 목록 — 신청과 신청 대상 글 정보를 함께 보여줘야 해서 join한 뷰
export type MySportsMateRequestItem = SportsMateRequest & {
	post: SportsMatePost;
};

export type SportsMateMessage = {
	id: string;
	request_id: string;
	sender_id: string;
	content: string;
	flagged: boolean;
	created_at: string;
};

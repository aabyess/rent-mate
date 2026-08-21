// features/sportsMate/apis.ts
import type {
	MySportsMateRequestItem,
	PatchSportsMatePostStatusInput,
	SportsMateMessage,
	SportsMatePost,
	SportsMatePostInput,
	SportsMateRequest,
} from "@/features/sportsMate/types";
import { createClient } from "@/libs/supabase/client";

const SPORTS_MATE_POST_COLUMNS =
	"id, author_id, author_name, sport, region, preferred_date, time_slot, gender_mode, comment, status, created_at";
const SPORTS_MATE_REQUEST_COLUMNS = "id, post_id, requester_id, requester_name, status, created_at";
const SPORTS_MATE_MESSAGE_COLUMNS = "id, request_id, sender_id, content, flagged, created_at";

// 모집 중인 글만 — 마감·매칭된 글은 탐색에서 빠진다
export async function getSportsMatePosts(): Promise<SportsMatePost[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("sports_mate_posts")
		.select(SPORTS_MATE_POST_COLUMNS)
		.eq("status", "open")
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as SportsMatePost[];
}

// 내 글은 상태 무관 전체 노출(마감된 것도 마이페이지에서 확인 가능해야 해서)
export async function getMySportsMatePosts(): Promise<SportsMatePost[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("sports_mate_posts")
		.select(SPORTS_MATE_POST_COLUMNS)
		.eq("author_id", user.id)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as SportsMatePost[];
}

export async function getSportsMatePost(postId: string): Promise<SportsMatePost | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("sports_mate_posts")
		.select(SPORTS_MATE_POST_COLUMNS)
		.eq("id", postId)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as SportsMatePost | null;
}

// author_name은 서버 트리거가 profiles.name으로 덮어써서 여기서 보내는 값은 무시된다
export async function postCreateSportsMatePost({
	sport,
	region,
	preferredDate,
	timeSlot,
	genderMode,
	comment,
}: SportsMatePostInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase.from("sports_mate_posts").insert({
		author_id: user.id,
		sport,
		region,
		preferred_date: preferredDate,
		time_slot: timeSlot,
		gender_mode: genderMode,
		comment,
	});
	if (error) {
		throw error;
	}
}

export async function patchSportsMatePost(
	postId: string,
	{ sport, region, preferredDate, timeSlot, genderMode, comment }: SportsMatePostInput,
): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("sports_mate_posts")
		.update({
			sport,
			region,
			preferred_date: preferredDate,
			time_slot: timeSlot,
			gender_mode: genderMode,
			comment,
		})
		.eq("id", postId);
	if (error) {
		throw error;
	}
}

export async function patchSportsMatePostStatus({
	postId,
	status,
}: PatchSportsMatePostStatusInput): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.from("sports_mate_posts").update({ status }).eq("id", postId);
	if (error) {
		throw error;
	}
}

// requester_name은 서버 트리거가 profiles.name으로 덮어써서 여기서 보내는 값은 무시된다
export async function postCreateSportsMateRequest(postId: string): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase
		.from("sports_mate_requests")
		.insert({ post_id: postId, requester_id: user.id });
	if (error) {
		throw error;
	}
}

export async function getSportsMateRequest(requestId: string): Promise<SportsMateRequest | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("sports_mate_requests")
		.select(SPORTS_MATE_REQUEST_COLUMNS)
		.eq("id", requestId)
		.maybeSingle();
	if (error) {
		throw error;
	}
	return (data ?? null) as SportsMateRequest | null;
}

// 내가 쓴 글에 들어온 신청 — 수락/거절 UI용
export async function getSportsMatePostRequests(postId: string): Promise<SportsMateRequest[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("sports_mate_requests")
		.select(SPORTS_MATE_REQUEST_COLUMNS)
		.eq("post_id", postId)
		.order("created_at", { ascending: true });
	if (error) {
		throw error;
	}
	return (data ?? []) as SportsMateRequest[];
}

// 내가 신청한 목록 — 글 정보까지 함께 보여줘야 해서 posts와 join한다.
// (2단계 RLS 확장으로 신청자는 자신이 신청한 글을 상태 무관 조회할 수 있다)
export async function getMySportsMateRequests(): Promise<MySportsMateRequestItem[]> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return [];
	}

	const { data, error } = await supabase
		.from("sports_mate_requests")
		.select(`${SPORTS_MATE_REQUEST_COLUMNS}, post:sports_mate_posts(${SPORTS_MATE_POST_COLUMNS})`)
		.eq("requester_id", user.id)
		.order("created_at", { ascending: false });
	if (error) {
		throw error;
	}
	return (data ?? []) as unknown as MySportsMateRequestItem[];
}

export async function patchSportsMateRequestStatus(
	requestId: string,
	status: "declined" | "cancelled",
): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase
		.from("sports_mate_requests")
		.update({ status })
		.eq("id", requestId);
	if (error) {
		throw error;
	}
}

// 신청 수락 — RPC가 신청 상태 전이·다른 신청 자동 거절·글 상태 matched 전이를 한번에 처리한다
export async function postAcceptSportsMateRequest(requestId: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.rpc("accept_sports_mate_request", {
		p_request_id: requestId,
	});
	if (error) {
		throw error;
	}
}

export async function getSportsMateMessages(requestId: string): Promise<SportsMateMessage[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("sports_mate_messages")
		.select(SPORTS_MATE_MESSAGE_COLUMNS)
		.eq("request_id", requestId)
		.order("created_at", { ascending: true });
	if (error) {
		throw error;
	}
	return (data ?? []) as SportsMateMessage[];
}

export async function postSportsMateMessage(requestId: string, content: string): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	const { error } = await supabase
		.from("sports_mate_messages")
		.insert({ request_id: requestId, sender_id: user.id, content });
	if (error) {
		throw error;
	}
}

// features/partnerPosts/apis.ts
import type { CreatePartnerPostInput, PartnerPost } from "@/features/partnerPosts/types";
import { createClient } from "@/libs/supabase/client";

export async function getPartnerPosts(partnerId: string): Promise<PartnerPost[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("partner_posts")
		.select("id, partner_id, content, photo_url, created_at")
		.eq("partner_id", partnerId)
		.order("created_at", { ascending: false })
		.limit(10);
	if (error) {
		throw error;
	}
	return (data ?? []) as PartnerPost[];
}

export async function postCreatePartnerPost({
	content,
	photo,
}: CreatePartnerPostInput): Promise<void> {
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new Error("로그인이 필요합니다.");
	}

	let photoUrl: string | null = null;
	if (photo) {
		const path = `${user.id}/post-${Date.now()}.${photo.name.split(".").pop() ?? "jpg"}`;
		const { error: uploadError } = await supabase.storage
			.from("partner-photos")
			.upload(path, photo);
		if (uploadError) {
			throw uploadError;
		}
		photoUrl = supabase.storage.from("partner-photos").getPublicUrl(path).data.publicUrl;
	}

	const { error } = await supabase.from("partner_posts").insert({
		partner_id: user.id,
		content,
		photo_url: photoUrl,
	});
	if (error) {
		throw error;
	}
}

export async function deletePartnerPost(postId: string): Promise<void> {
	const supabase = createClient();
	const { error } = await supabase.from("partner_posts").delete().eq("id", postId);
	if (error) {
		throw error;
	}
}

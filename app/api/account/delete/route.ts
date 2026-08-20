// app/api/account/delete/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/libs/supabase/admin";
import { createClient } from "@/libs/supabase/server";

// 회원 탈퇴: ① RPC로 소프트 삭제·익명화(가드 포함) ② admin ban으로 로그인 차단
// ③ 파트너 사진 스토리지 정리(best effort) ④ 세션 종료
export async function POST(): Promise<NextResponse> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
	}

	const { error: rpcError } = await supabase.rpc("delete_my_account");
	if (rpcError) {
		return NextResponse.json({ error: rpcError.message }, { status: 400 });
	}

	// 익명화는 끝났는데 ban이 실패하면 로그인이 계속 가능해지므로 이건 실패로 응답한다.
	// RPC는 멱등이라 사용자가 재시도하면 ban부터 다시 밟는다.
	const admin = createAdminClient();
	const { error: banError } = await admin.auth.admin.updateUserById(user.id, {
		ban_duration: "876000h",
	});
	if (banError) {
		console.error("[account/delete] ban failed", user.id, banError);
		return NextResponse.json(
			{ error: "탈퇴 처리 중 문제가 생겼어요. 잠시 후 다시 시도해주세요." },
			{ status: 500 },
		);
	}

	// 파트너였던 경우 본인 폴더의 사진 파일 정리 — 실패해도 탈퇴는 유효하므로 로그만 남긴다
	try {
		const { data: files } = await admin.storage.from("partner-photos").list(user.id);
		if (files && files.length > 0) {
			await admin.storage.from("partner-photos").remove(
				files.map(function (file) {
					return `${user.id}/${file.name}`;
				}),
			);
		}
	} catch (storageError) {
		console.error("[account/delete] photo cleanup failed", user.id, storageError);
	}

	await supabase.auth.signOut();
	return NextResponse.json({ ok: true });
}

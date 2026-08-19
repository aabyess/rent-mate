// libs/supabase/admin.ts
// 서버 전용 admin 클라이언트 — RLS를 우회하므로 API 라우트 밖에서 절대 import 금지
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

export function createAdminClient(): SupabaseClient {
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceRoleKey) {
		throw new Error("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.");
	}
	return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
}

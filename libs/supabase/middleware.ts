// libs/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 비로그인 접근 허용 경로. 약관·정책은 가입 전에도 열람 가능해야 한다.
// /api/reminders/run은 Vercel 크론이 세션 없이 호출한다 — 라우트 자체의 CRON_SECRET
// Bearer 검증이 인증을 대신하므로 로그인 리다이렉트에서 제외해야 핸들러에 도달한다.
const PUBLIC_PATHS = ["/login", "/signup", "/policies", "/api/reminders/run", "/shared-date"];
// 로그인 상태에서 접근하면 홈으로 돌려보내는 인증 전용 페이지
const AUTH_PAGES = ["/login", "/signup"];

export async function updateSession(request: NextRequest): Promise<NextResponse> {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(function ({ name, value }) {
						request.cookies.set(name, value);
					});
					supabaseResponse = NextResponse.next({ request });
					cookiesToSet.forEach(function ({ name, value, options }) {
						supabaseResponse.cookies.set(name, value, options);
					});
				},
			},
		},
	);

	// getUser()가 세션 쿠키를 갱신하므로 반드시 호출한다
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const { pathname } = request.nextUrl;
	const isPublicPath = PUBLIC_PATHS.some(function (path) {
		return pathname.startsWith(path);
	});

	if (!user && !isPublicPath) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	const isAuthPage = AUTH_PAGES.some(function (path) {
		return pathname.startsWith(path);
	});
	if (user && isAuthPage) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}

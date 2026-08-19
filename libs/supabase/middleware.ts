// libs/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];

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

	if (user && isPublicPath) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}

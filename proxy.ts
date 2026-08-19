// proxy.ts
import type { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/libs/supabase/middleware";

export default async function proxy(request: NextRequest): Promise<NextResponse> {
	return updateSession(request);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};

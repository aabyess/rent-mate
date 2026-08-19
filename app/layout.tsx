// app/layout.tsx
import type { Metadata } from "next";
import type { JSX } from "react";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "RentMate",
	description: "시간제 데이트 동행 매칭 플랫폼",
};

export default function RootLayout({ children }: LayoutProps<"/">): JSX.Element {
	return (
		<html lang="ko" className="h-full antialiased">
			<body className="flex min-h-full flex-col">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

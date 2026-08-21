// app/intro/page.tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type JSX } from "react";

const HOLD_MS = 2200;
const REDUCED_HOLD_MS = 1400;
const EXIT_MS = 350;

// 로그인·온보딩 직후 잠깐 보여주는 브랜드 인트로 — 자동으로 홈으로 넘어간다
export default function IntroPage(): JSX.Element {
	const router = useRouter();
	const shouldReduceMotion = useReducedMotion();
	const [isLeaving, setIsLeaving] = useState(false);

	useEffect(
		function () {
			const holdMs = shouldReduceMotion ? REDUCED_HOLD_MS : HOLD_MS;
			const exitTimer = setTimeout(function () {
				setIsLeaving(true);
			}, holdMs);
			const navigateTimer = setTimeout(
				function () {
					router.replace("/");
				},
				holdMs + (shouldReduceMotion ? 0 : EXIT_MS),
			);
			return function () {
				clearTimeout(exitTimer);
				clearTimeout(navigateTimer);
			};
		},
		[router, shouldReduceMotion],
	);

	return (
		<motion.main
			animate={{ opacity: isLeaving && !shouldReduceMotion ? 0 : 1 }}
			transition={{ duration: EXIT_MS / 1000, ease: "easeOut" }}
			className="relative flex min-h-screen items-center justify-center overflow-hidden">
			<div className="from-primary-50 to-secondary-50 via-bg absolute inset-0 bg-gradient-to-br" />
			<div className="bg-primary-200/40 absolute -top-24 -right-20 size-72 rounded-full blur-3xl" />
			<div className="bg-secondary-200/40 absolute -bottom-28 -left-24 size-80 rounded-full blur-3xl" />
			<div className="relative flex flex-col items-center gap-3">
				<motion.span
					initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
					className="text-brand text-4xl font-bold tracking-tight">
					RentMate
				</motion.span>
				<motion.p
					initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut", delay: 0.55 }}
					className="text-body text-[15px]">
					연애, <span className="text-heart font-semibold">연습</span>이 필요하니까
				</motion.p>
			</div>
		</motion.main>
	);
}

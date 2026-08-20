// features/partners/components/PartnerList/PartnerListDeckMotionCard.tsx
"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import type { JSX, ReactNode } from "react";

const SWIPE_OFFSET_PX = 90;
const SWIPE_VELOCITY = 500;

// AnimatePresence custom으로 전달되는 값 — 나갈 방향과 이동 방향(앞/뒤)
export type DeckMotionCustom = {
	exitX: -1 | 1;
	nav: -1 | 1;
	offset: number;
};

type PartnerListDeckMotionCardProps = {
	isTop: boolean;
	custom: DeckMotionCustom;
	ariaLabel: string;
	onSwipe: (direction: -1 | 1) => void;
	onDragStart: () => void;
	onDragEnd: () => void;
	onTap?: (event: MouseEvent | TouchEvent | PointerEvent) => void;
	children: ReactNode;
};

const variants = {
	initial: function (custom: DeckMotionCustom) {
		// 뒤로가기로 맨 위에 새로 들어오는 카드는 옆에서 슬라이드 인,
		// 앞으로 넘길 때 스택 바닥에 들어오는 카드는 뒤에서 떠오른다
		if (custom.nav === -1 && custom.offset === 0) {
			return { x: -520, rotate: -14, opacity: 0, scale: 1, y: 0 };
		}
		return { x: 0, rotate: 0, opacity: 0, scale: 0.88, y: 24 };
	},
	animate: function (custom: DeckMotionCustom) {
		return {
			x: 0,
			rotate: 0,
			opacity: 1,
			scale: 1 - custom.offset * 0.045,
			y: custom.offset * 12,
			transition: { type: "spring" as const, stiffness: 300, damping: 28 },
		};
	},
	exit: function (custom: DeckMotionCustom) {
		// 앞으로 넘길 땐 틴더처럼 회전하며 날아가고, 뒤로 갈 땐 바닥 카드가 조용히 가라앉는다
		if (custom.nav === -1) {
			return { opacity: 0, scale: 0.88, y: 24, transition: { duration: 0.2 } };
		}
		return {
			x: custom.exitX * 560,
			rotate: custom.exitX * 16,
			opacity: 0,
			transition: { duration: 0.32, ease: "easeIn" as const },
		};
	},
};

// 스택 카드 한 장의 모션 래퍼 — 맨 위 카드만 드래그 가능, 임계값을 넘기면 스와이프로 판정
export function PartnerListDeckMotionCard({
	isTop,
	custom,
	ariaLabel,
	onSwipe,
	onDragStart,
	onDragEnd,
	onTap,
	children,
}: PartnerListDeckMotionCardProps): JSX.Element {
	const x = useMotionValue(0);
	const dragRotate = useTransform(x, [-240, 240], [-10, 10]);

	function handleDragEnd(_event: PointerEvent, info: PanInfo): void {
		onDragEnd();
		if (Math.abs(info.offset.x) > SWIPE_OFFSET_PX || Math.abs(info.velocity.x) > SWIPE_VELOCITY) {
			onSwipe(info.offset.x < 0 ? -1 : 1);
		}
	}

	return (
		<motion.div
			role={onTap ? "button" : undefined}
			aria-label={ariaLabel}
			custom={custom}
			variants={variants}
			initial="initial"
			animate="animate"
			exit="exit"
			drag={isTop ? "x" : false}
			dragSnapToOrigin
			dragElastic={0.8}
			style={
				isTop
					? { x, rotate: dragRotate, zIndex: 10 - custom.offset }
					: { zIndex: 10 - custom.offset }
			}
			onDragStart={onDragStart}
			onDragEnd={handleDragEnd}
			onTap={onTap}
			className="absolute inset-0 cursor-grab active:cursor-grabbing">
			{children}
		</motion.div>
	);
}

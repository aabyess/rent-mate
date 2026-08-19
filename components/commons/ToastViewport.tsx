// components/commons/ToastViewport.tsx
"use client";

import { useEffect, type JSX } from "react";
import { useToastStore } from "@/store/useToastStore";

const TOAST_DURATION_MS = 3500;

type ToastItemProps = {
	id: string;
	message: string;
};

function ToastItem({ id, message }: ToastItemProps): JSX.Element {
	const dismissToast = useToastStore(function (state) {
		return state.dismissToast;
	});

	useEffect(
		function () {
			const timer = setTimeout(function () {
				dismissToast(id);
			}, TOAST_DURATION_MS);
			return function () {
				clearTimeout(timer);
			};
		},
		[id, dismissToast],
	);

	return (
		<p className="pointer-events-auto rounded-full bg-neutral-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
			{message}
		</p>
	);
}

export function ToastViewport(): JSX.Element {
	const toasts = useToastStore(function (state) {
		return state.toasts;
	});

	return (
		<div className="pointer-events-none fixed top-4 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-5">
			{toasts.map(function (toast) {
				return <ToastItem key={toast.id} id={toast.id} message={toast.message} />;
			})}
		</div>
	);
}

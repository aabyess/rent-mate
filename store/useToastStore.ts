// store/useToastStore.ts
"use client";

import { create } from "zustand";

const MAX_VISIBLE_TOASTS = 3;

type Toast = {
	id: string;
	message: string;
};

type ToastStore = {
	toasts: Toast[];
	showToast: (message: string) => void;
	dismissToast: (id: string) => void;
};

export const useToastStore = create<ToastStore>()(function (set) {
	return {
		toasts: [],
		showToast: function (message) {
			const toast: Toast = { id: crypto.randomUUID(), message };
			set(function (state) {
				return { toasts: [...state.toasts, toast].slice(-MAX_VISIBLE_TOASTS) };
			});
		},
		dismissToast: function (id) {
			set(function (state) {
				return {
					toasts: state.toasts.filter(function (toast) {
						return toast.id !== id;
					}),
				};
			});
		},
	};
});

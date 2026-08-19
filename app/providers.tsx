// app/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { JSX, ReactNode } from "react";
import { getQueryClient } from "@/libs/queryClient";

type ProvidersProps = {
	children: ReactNode;
};

export function Providers({ children }: ProvidersProps): JSX.Element {
	const queryClient = getQueryClient();

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

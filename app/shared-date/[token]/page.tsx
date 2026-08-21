// app/shared-date/[token]/page.tsx
import type { JSX } from "react";
import { SharedDateView } from "@/features/dateShare/components/SharedDateView";

type SharedDatePageProps = {
	params: Promise<{ token: string }>;
};

export default async function SharedDatePage({
	params,
}: SharedDatePageProps): Promise<JSX.Element> {
	const { token } = await params;
	return <SharedDateView token={token} />;
}

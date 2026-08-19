// features/partners/components/PartnerRegisterForm/index.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreatePartnerProfileMutation } from "@/features/partners/mutations";
import { cn } from "@/utils/cn";

const INTEREST_OPTIONS = [
	"카페 투어",
	"전시 관람",
	"산책",
	"맛집 탐방",
	"영화",
	"보드게임",
	"사진",
	"서점 데이트",
	"브런치",
	"디저트 투어",
];

const MIN_HOURLY_RATE_KRW = 10000;

export function PartnerRegisterForm(): JSX.Element {
	const router = useRouter();
	const createPartnerProfileMutation = useCreatePartnerProfileMutation();

	const [nickname, setNickname] = useState("");
	const [birthYear, setBirthYear] = useState("");
	const [bio, setBio] = useState("");
	const [hourlyRate, setHourlyRate] = useState("30000");
	const [interests, setInterests] = useState<string[]>([]);

	function handleInterestToggle(interest: string): void {
		setInterests(function (current) {
			if (current.includes(interest)) {
				return current.filter(function (item) {
					return item !== interest;
				});
			}
			if (current.length >= 3) {
				return current;
			}
			return [...current, interest];
		});
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		createPartnerProfileMutation.mutate(
			{
				nickname: nickname.trim(),
				bio: bio.trim(),
				hourlyRateKrw: Number(hourlyRate),
				birthYear: Number(birthYear),
				interests,
			},
			{
				onSuccess: function (): void {
					router.replace("/me");
					router.refresh();
				},
			},
		);
	}

	const isValid =
		nickname.trim().length >= 2 &&
		bio.trim().length >= 10 &&
		Number(birthYear) >= 1950 &&
		Number(birthYear) <= 2007 &&
		Number(hourlyRate) >= MIN_HOURLY_RATE_KRW &&
		interests.length > 0;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<section className="flex flex-col gap-2">
				<label htmlFor="nickname" className="text-sm font-medium">
					활동 닉네임
				</label>
				<Input
					id="nickname"
					value={nickname}
					onChange={function (event) {
						setNickname(event.target.value);
					}}
					placeholder="프로필에 표시될 닉네임 (2자 이상)"
					required
					minLength={2}
					maxLength={12}
				/>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="birthYear" className="text-sm font-medium">
					출생 연도
				</label>
				<Input
					id="birthYear"
					type="number"
					value={birthYear}
					onChange={function (event) {
						setBirthYear(event.target.value);
					}}
					placeholder="예: 1999"
					required
					min={1950}
					max={2007}
				/>
				<p className="text-sub text-xs">
					프로필에는 나이로 표시돼요. 만 19세 이상만 활동할 수 있어요.
				</p>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="bio" className="text-sm font-medium">
					자기소개
				</label>
				<textarea
					id="bio"
					value={bio}
					onChange={function (event) {
						setBio(event.target.value);
					}}
					placeholder="어떤 데이트를 좋아하는지 알려주세요 (10자 이상)"
					required
					minLength={10}
					maxLength={300}
					rows={4}
					className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-4 text-base focus:outline-none"
				/>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">관심사 (최대 3개)</span>
				<div className="flex flex-wrap gap-2">
					{INTEREST_OPTIONS.map(function (interest) {
						const selected = interests.includes(interest);
						return (
							<button
								key={interest}
								type="button"
								onClick={function () {
									handleInterestToggle(interest);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-neutral-900 font-semibold text-white",
									!selected && "bg-surface-alt text-body",
								)}>
								{interest}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="hourlyRate" className="text-sm font-medium">
					시간당 요금 (원)
				</label>
				<Input
					id="hourlyRate"
					type="number"
					value={hourlyRate}
					onChange={function (event) {
						setHourlyRate(event.target.value);
					}}
					required
					min={MIN_HOURLY_RATE_KRW}
					step={1000}
				/>
			</section>

			<div className="flex flex-col gap-2.5">
				<p className="bg-warning-100 text-warning-700 rounded-xl px-4 py-3 text-xs leading-relaxed">
					파트너 활동은 공개 장소 데이트 동행만 포함해요. 신체 접촉·성적 서비스 제안은 금지되며,
					위반 시 계정이 영구 제한되고 관련 법에 따라 신고될 수 있어요.
				</p>
				{createPartnerProfileMutation.isError && (
					<p className="text-error-500 text-sm">{createPartnerProfileMutation.error.message}</p>
				)}
				<Button
					type="submit"
					size="lg"
					fullWidth
					disabled={!isValid || createPartnerProfileMutation.isPending}>
					{createPartnerProfileMutation.isPending ? "등록 중..." : "파트너 프로필 등록"}
				</Button>
			</div>
		</form>
	);
}

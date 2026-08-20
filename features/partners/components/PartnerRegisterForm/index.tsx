// features/partners/components/PartnerRegisterForm/index.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PURPOSE_TAGS } from "@/constants/purposeTags";
import { REGIONS } from "@/constants/regions";
import {
	MIN_PARTNER_PHOTOS,
	PartnerPhotoUploader,
} from "@/features/partners/components/PartnerPhotoUploader";
import { useCreatePartnerProfileMutation } from "@/features/partners/mutations";
import { INTEREST_OPTIONS, MIN_HOURLY_RATE_KRW, WEEKDAY_OPTIONS } from "@/features/partners/utils";
import { findBannedPhrase } from "@/utils/bannedPhrases";
import { cn } from "@/utils/cn";

export function PartnerRegisterForm(): JSX.Element {
	const router = useRouter();
	const createPartnerProfileMutation = useCreatePartnerProfileMutation();

	const [nickname, setNickname] = useState("");
	const [birthYear, setBirthYear] = useState("");
	const [bio, setBio] = useState("");
	const [hourlyRate, setHourlyRate] = useState("30000");
	const [heightCm, setHeightCm] = useState("");
	const [weightKg, setWeightKg] = useState("");
	const [interests, setInterests] = useState<string[]>([]);
	const [availableWeekdays, setAvailableWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
	const [photos, setPhotos] = useState<File[]>([]);
	const [region, setRegion] = useState<string | null>(null);
	const [purposeTags, setPurposeTags] = useState<string[]>([]);
	const [bannedPhrase, setBannedPhrase] = useState<string | null>(null);

	function handlePurposeTagToggle(tag: string): void {
		setPurposeTags(function (current) {
			if (current.includes(tag)) {
				return current.filter(function (item) {
					return item !== tag;
				});
			}
			if (current.length >= 2) {
				return current;
			}
			return [...current, tag];
		});
	}

	function handleWeekdayToggle(weekday: number): void {
		setAvailableWeekdays(function (current) {
			if (current.includes(weekday)) {
				return current.filter(function (item) {
					return item !== weekday;
				});
			}
			return [...current, weekday].sort();
		});
	}

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
		// 성매매 연상 표현은 프로필에 저장 자체를 막는다 (법적 제약 3번, DB 트리거와 이중 방어)
		const banned = findBannedPhrase(`${nickname} ${bio}`);
		if (banned !== null) {
			setBannedPhrase(banned);
			return;
		}
		setBannedPhrase(null);
		createPartnerProfileMutation.mutate(
			{
				nickname: nickname.trim(),
				bio: bio.trim(),
				hourlyRateKrw: Number(hourlyRate),
				birthYear: Number(birthYear),
				heightCm: heightCm.trim() === "" ? null : Number(heightCm),
				weightKg: weightKg.trim() === "" ? null : Number(weightKg),
				interests,
				availableWeekdays,
				photos,
				region: region ?? "",
				purposeTags,
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
		interests.length > 0 &&
		availableWeekdays.length > 0 &&
		region !== null &&
		photos.length >= MIN_PARTNER_PHOTOS;

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
				<span className="text-sm font-medium">
					신체 정보 <span className="text-sub font-normal">(선택)</span>
				</span>
				<div className="flex gap-2">
					<Input
						type="number"
						value={heightCm}
						onChange={function (event) {
							setHeightCm(event.target.value);
						}}
						placeholder="키 (cm)"
						min={130}
						max={220}
						aria-label="키 (cm)"
					/>
					<Input
						type="number"
						value={weightKg}
						onChange={function (event) {
							setWeightKg(event.target.value);
						}}
						placeholder="몸무게 (kg)"
						min={30}
						max={150}
						aria-label="몸무게 (kg)"
					/>
				</div>
				<p className="text-sub text-xs">
					입력하면 프로필 상세에 표시돼요. 비워두면 표시되지 않아요.
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
				<span className="text-sm font-medium">프로필 사진 (3~9장 필수)</span>
				<PartnerPhotoUploader photos={photos} onPhotosChange={setPhotos} />
				<p className="text-sub text-xs">
					최소 3장을 올려야 등록할 수 있어요. 첫 번째 사진이 대표 사진이에요.
				</p>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">활동 지역</span>
				<div className="flex flex-wrap gap-2">
					{REGIONS.map(function (regionOption) {
						const selected = region === regionOption;
						return (
							<button
								key={regionOption}
								type="button"
								onClick={function () {
									setRegion(regionOption);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{regionOption}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">용도 태그 (선택, 최대 2개)</span>
				<div className="flex flex-wrap gap-2">
					{PURPOSE_TAGS.map(function (tag) {
						const selected = purposeTags.includes(tag);
						return (
							<button
								key={tag}
								type="button"
								onClick={function () {
									handlePurposeTagToggle(tag);
								}}
								className={cn(
									"h-10 rounded-full px-4 text-sm",
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{tag}
							</button>
						);
					})}
				</div>
				<p className="text-sub text-xs">
					어떤 목적의 만남에 어울리는지 알려주면 매칭에 도움이 돼요.
				</p>
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
									selected && "bg-inverse text-inverse-fg font-semibold",
									!selected && "bg-surface-alt text-body",
								)}>
								{interest}
							</button>
						);
					})}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">가능 요일</span>
				<div className="grid grid-cols-7 gap-1.5">
					{WEEKDAY_OPTIONS.map(function (weekday) {
						const selected = availableWeekdays.includes(weekday.value);
						return (
							<button
								key={weekday.value}
								type="button"
								onClick={function () {
									handleWeekdayToggle(weekday.value);
								}}
								className={cn(
									"flex h-11 items-center justify-center rounded-xl text-sm",
									selected && "bg-brand-subtle text-primary-600 font-semibold",
									!selected && "bg-surface-alt text-sub",
								)}>
								{weekday.label}
							</button>
						);
					})}
				</div>
				<p className="text-sub text-xs">선택한 요일에만 예약을 받을 수 있어요.</p>
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
				<p className="bg-warning-500/15 text-warning-500 rounded-xl px-4 py-3 text-xs leading-relaxed">
					파트너 활동은 공개 장소 데이트 동행만 포함해요. 신체 접촉·성적 서비스 제안은 금지되며,
					위반 시 계정이 영구 제한되고 관련 법에 따라 신고될 수 있어요. 등록 후 관리자 승인을 거쳐
					프로필이 공개돼요.
				</p>
				{bannedPhrase !== null && (
					<p className="text-error-500 text-sm">
						&lsquo;{bannedPhrase}&rsquo; 표현은 프로필에 사용할 수 없어요. 성적 서비스를 연상시키는
						표현은 제재 대상입니다.
					</p>
				)}
				{createPartnerProfileMutation.isError && (
					<p className="text-error-500 text-sm">{createPartnerProfileMutation.error.message}</p>
				)}
				<Button
					type="submit"
					size="lg"
					fullWidth
					disabled={!isValid}
					isLoading={createPartnerProfileMutation.isPending}>
					{createPartnerProfileMutation.isPending ? "사진 업로드 중..." : "파트너 프로필 등록"}
				</Button>
			</div>
		</form>
	);
}

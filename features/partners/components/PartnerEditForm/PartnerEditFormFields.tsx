// features/partners/components/PartnerEditForm/PartnerEditFormFields.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PURPOSE_TAGS } from "@/constants/purposeTags";
import { PartnerPhotoManager } from "@/features/partners/components/PartnerPhotoManager";
import {
	MAX_PARTNER_PHOTOS,
	MIN_PARTNER_PHOTOS,
} from "@/features/partners/components/PartnerPhotoUploader";
import { PartnerQnaFields } from "@/features/partners/components/PartnerQnaFields";
import { usePatchPartnerProfileMutation } from "@/features/partners/mutations";
import { EMPTY_QNA, type PartnerQna } from "@/features/partners/qna";
import type { MyPartnerProfile } from "@/features/partners/types";
import {
	findFirstInvalidField,
	formatKrw,
	INTEREST_OPTIONS,
	MIN_HOURLY_RATE_KRW,
	scrollToFieldError,
	WEEKDAY_OPTIONS,
} from "@/features/partners/utils";
import { RegionPicker } from "@/features/shared/components/RegionPicker";
import { findBannedPhrase } from "@/utils/bannedPhrases";
import { cn } from "@/utils/cn";

type PartnerEditFormFieldsProps = {
	profile: MyPartnerProfile;
};

// 부모(PartnerEditForm)가 profile.profile_id를 key로 마운트하므로,
// 여기서는 로드된 profile 값을 useState 초기값으로 그대로 써도 안전하다 (effect로 동기화할 필요 없음)
export function PartnerEditFormFields({ profile }: PartnerEditFormFieldsProps): JSX.Element {
	const router = useRouter();
	const patchPartnerProfileMutation = usePatchPartnerProfileMutation();

	const [nickname, setNickname] = useState(profile.nickname);
	const [bio, setBio] = useState(profile.bio);
	const [hourlyRate, setHourlyRate] = useState(String(profile.hourly_rate_krw));
	const [heightCm, setHeightCm] = useState(
		profile.height_cm === null ? "" : String(profile.height_cm),
	);
	const [weightKg, setWeightKg] = useState(
		profile.weight_kg === null ? "" : String(profile.weight_kg),
	);
	const [interests, setInterests] = useState<string[]>(profile.interests);
	const [availableWeekdays, setAvailableWeekdays] = useState<number[]>(profile.available_weekdays);
	const [availableStartHour, setAvailableStartHour] = useState(
		String(profile.available_start_hour),
	);
	const [availableEndHour, setAvailableEndHour] = useState(String(profile.available_end_hour));
	const [region, setRegion] = useState<string | null>(profile.region);
	const [purposeTags, setPurposeTags] = useState<string[]>(profile.purpose_tags);
	const [qna, setQna] = useState<PartnerQna>({ ...EMPTY_QNA, ...profile.qna });
	const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>(profile.photo_urls);
	const [newPhotos, setNewPhotos] = useState<File[]>([]);
	const [fieldError, setFieldError] = useState<{ id: string; message: string } | null>(null);

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

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		// 성매매 연상 표현은 프로필에 저장 자체를 막는다 (법적 제약 3번, DB 트리거와 이중 방어)
		const nicknameBanned = findBannedPhrase(nickname);
		const bioBanned = findBannedPhrase(bio);
		const firstImpressionBanned = findBannedPhrase(qna.firstImpression);
		const topicAllNightBanned = findBannedPhrase(qna.topicAllNight);
		const smallHappinessBanned = findBannedPhrase(qna.smallHappiness);
		const photoCount = existingPhotoUrls.length + newPhotos.length;
		let photoMessage = "사진은 최소 3장 유지해야 해요";
		if (photoCount > MAX_PARTNER_PHOTOS) {
			photoMessage = "사진은 최대 9장까지 올릴 수 있어요";
		}
		const firstInvalid = findFirstInvalidField([
			{
				id: "nickname",
				message: nicknameBanned
					? `'${nicknameBanned}' 표현은 닉네임에 사용할 수 없어요.`
					: "닉네임은 2자 이상이에요",
				isValid: nickname.trim().length >= 2 && !nicknameBanned,
			},
			{
				id: "heightCm",
				message: "키는 130~220cm 사이로 입력해주세요",
				isValid: heightCm.trim() === "" || (Number(heightCm) >= 130 && Number(heightCm) <= 220),
			},
			{
				id: "weightKg",
				message: "몸무게는 30~150kg 사이로 입력해주세요",
				isValid: weightKg.trim() === "" || (Number(weightKg) >= 30 && Number(weightKg) <= 150),
			},
			{
				id: "bio",
				message: bioBanned
					? `'${bioBanned}' 표현은 소개에 사용할 수 없어요.`
					: "소개는 10자 이상 적어주세요",
				isValid: bio.trim().length >= 10 && !bioBanned,
			},
			{
				id: "qna-firstImpression",
				message: firstImpressionBanned
					? `'${firstImpressionBanned}' 표현은 사용할 수 없어요.`
					: "첫인상을 20자 이내로 적어주세요",
				isValid:
					qna.firstImpression.trim().length > 0 &&
					qna.firstImpression.trim().length <= 20 &&
					!firstImpressionBanned,
			},
			{
				id: "qna-hobbies",
				message: "요즘 취미를 1~2개 선택해주세요",
				isValid: qna.hobbies.length >= 1 && qna.hobbies.length <= 2,
			},
			{
				id: "qna-genres",
				message: "좋아하는 영화·드라마 장르를 1~2개 선택해주세요",
				isValid: qna.genres.length >= 1 && qna.genres.length <= 2,
			},
			{
				id: "qna-topicAllNight",
				message: topicAllNightBanned
					? `'${topicAllNightBanned}' 표현은 사용할 수 없어요.`
					: "밤새 얘기할 수 있는 주제를 40자 이내로 적어주세요",
				isValid:
					qna.topicAllNight.trim().length > 0 &&
					qna.topicAllNight.trim().length <= 40 &&
					!topicAllNightBanned,
			},
			{
				id: "qna-courseCategories",
				message: "선호하는 데이트 장소를 1~2개 선택해주세요",
				isValid: qna.courseCategories.length >= 1 && qna.courseCategories.length <= 2,
			},
			{
				id: "qna-smallHappiness",
				message: smallHappinessBanned
					? `'${smallHappinessBanned}' 표현은 사용할 수 없어요.`
					: "소소한 행복을 40자 이내로 적어주세요",
				isValid:
					qna.smallHappiness.trim().length > 0 &&
					qna.smallHappiness.trim().length <= 40 &&
					!smallHappinessBanned,
			},
			{
				id: "partner-edit-photos",
				message: photoMessage,
				isValid: photoCount >= MIN_PARTNER_PHOTOS && photoCount <= MAX_PARTNER_PHOTOS,
			},
			{
				id: "partner-edit-region",
				message: "활동 지역을 선택해주세요",
				isValid: region !== null,
			},
			{
				id: "partner-edit-interests",
				message: "관심사를 1개 이상 골라주세요",
				isValid: interests.length > 0,
			},
			{
				id: "partner-edit-weekdays",
				message: "가능 요일을 선택해주세요",
				isValid: availableWeekdays.length > 0,
			},
			{
				id: "partner-edit-hours",
				message: "가능 시간대를 0~24 사이로, 시작이 종료보다 빠르게 입력해주세요",
				isValid:
					Number(availableStartHour) >= 0 &&
					Number(availableStartHour) <= 24 &&
					Number(availableEndHour) >= 0 &&
					Number(availableEndHour) <= 24 &&
					Number(availableStartHour) < Number(availableEndHour),
			},
			{
				id: "hourlyRate",
				message: `시간당 요금은 ${formatKrw(MIN_HOURLY_RATE_KRW)} 이상이어야 해요`,
				isValid: Number(hourlyRate) >= MIN_HOURLY_RATE_KRW,
			},
		]);
		if (firstInvalid) {
			setFieldError(firstInvalid);
			scrollToFieldError(firstInvalid.id);
			return;
		}
		setFieldError(null);
		patchPartnerProfileMutation.mutate(
			{
				nickname: nickname.trim(),
				bio: bio.trim(),
				hourlyRateKrw: Number(hourlyRate),
				heightCm: heightCm.trim() === "" ? null : Number(heightCm),
				weightKg: weightKg.trim() === "" ? null : Number(weightKg),
				interests,
				availableWeekdays,
				availableStartHour: Number(availableStartHour),
				availableEndHour: Number(availableEndHour),
				region: region ?? "",
				purposeTags,
				qna: {
					...qna,
					firstImpression: qna.firstImpression.trim(),
					topicAllNight: qna.topicAllNight.trim(),
					smallHappiness: qna.smallHappiness.trim(),
				},
				existingPhotoUrls,
				newPhotos,
			},
			{
				onSuccess: function (): void {
					router.replace("/me");
					router.refresh();
				},
			},
		);
	}

	return (
		<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
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
					maxLength={12}
				/>
				{fieldError?.id === "nickname" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">출생 연도</span>
				<p className="bg-surface-alt text-sub rounded-xl px-4 py-3 text-sm">
					{profile.birth_year}년생 (수정 불가)
				</p>
			</section>

			<section className="flex flex-col gap-2">
				<span className="text-sm font-medium">
					신체 정보 <span className="text-sub font-normal">(선택)</span>
				</span>
				<div className="flex gap-2">
					<Input
						id="heightCm"
						type="number"
						value={heightCm}
						onChange={function (event) {
							setHeightCm(event.target.value);
						}}
						placeholder="키 (cm)"
						aria-label="키 (cm)"
					/>
					<Input
						id="weightKg"
						type="number"
						value={weightKg}
						onChange={function (event) {
							setWeightKg(event.target.value);
						}}
						placeholder="몸무게 (kg)"
						aria-label="몸무게 (kg)"
					/>
				</div>
				<p className="text-sub text-xs">
					입력하면 프로필 상세에 표시돼요. 비워두면 표시되지 않아요.
				</p>
				{fieldError?.id === "heightCm" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
				{fieldError?.id === "weightKg" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
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
					maxLength={300}
					rows={4}
					className="bg-surface-alt text-body placeholder:text-sub w-full resize-none rounded-xl p-4 text-base focus:outline-none"
				/>
				{fieldError?.id === "bio" && <p className="text-error-500 text-xs">{fieldError.message}</p>}
			</section>

			<PartnerQnaFields qna={qna} onChange={setQna} fieldError={fieldError} />

			<section id="partner-edit-photos" className="flex flex-col gap-2">
				<span className="text-sm font-medium">프로필 사진 (3~9장)</span>
				<PartnerPhotoManager
					existingUrls={existingPhotoUrls}
					onExistingUrlsChange={setExistingPhotoUrls}
					newPhotos={newPhotos}
					onNewPhotosChange={setNewPhotos}
				/>
				<p className="text-sub text-xs">최소 3장을 유지해야 저장할 수 있어요.</p>
				{fieldError?.id === "partner-edit-photos" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="partner-edit-region" className="flex flex-col gap-2">
				<span className="text-sm font-medium">활동 지역</span>
				<RegionPicker
					selectedValues={region ? [region] : []}
					onToggle={function (value) {
						setRegion(value);
					}}
				/>
				{fieldError?.id === "partner-edit-region" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
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
			</section>

			<section id="partner-edit-interests" className="flex flex-col gap-2">
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
				{fieldError?.id === "partner-edit-interests" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="partner-edit-weekdays" className="flex flex-col gap-2">
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
				{fieldError?.id === "partner-edit-weekdays" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<section id="partner-edit-hours" className="flex flex-col gap-2">
				<span className="text-sm font-medium">가능 시간대</span>
				<div className="flex items-center gap-2">
					<Input
						type="number"
						value={availableStartHour}
						onChange={function (event) {
							setAvailableStartHour(event.target.value);
						}}
						placeholder="시작 시각"
						aria-label="가능 시작 시각"
						min={0}
						max={24}
					/>
					<span className="text-sub text-sm">~</span>
					<Input
						type="number"
						value={availableEndHour}
						onChange={function (event) {
							setAvailableEndHour(event.target.value);
						}}
						placeholder="종료 시각"
						aria-label="가능 종료 시각"
						min={0}
						max={24}
					/>
				</div>
				<p className="text-sub text-xs">이 시간대 안에서만 예약을 받을 수 있어요.</p>
				{fieldError?.id === "partner-edit-hours" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
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
					step={1000}
				/>
				{fieldError?.id === "hourlyRate" && (
					<p className="text-error-500 text-xs">{fieldError.message}</p>
				)}
			</section>

			<div className="flex flex-col gap-2.5">
				{profile.is_approved && (
					<p className="bg-warning-500/15 text-warning-500 rounded-xl px-4 py-3 text-xs leading-relaxed">
						수정 사항은 저장 즉시 반영돼요. 부적절한 내용으로 변경하면 관리자 검토 후 활동이 제한될
						수 있어요.
					</p>
				)}
				{patchPartnerProfileMutation.isError && (
					<p className="text-error-500 text-sm">{patchPartnerProfileMutation.error.message}</p>
				)}
				<Button type="submit" size="lg" fullWidth isLoading={patchPartnerProfileMutation.isPending}>
					{patchPartnerProfileMutation.isPending
						? newPhotos.length > 0
							? "사진 업로드 중..."
							: "저장 중..."
						: "변경사항 저장"}
				</Button>
			</div>
		</form>
	);
}

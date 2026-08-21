-- supabase/migrations/20260821170500_review_token_reward.sql
-- 20자 이상 정성 후기 작성 시 토큰 20개 지급. reviews.booking_id의 unique 제약이
-- 예약당 후기 1건만 허용하고 삭제 정책도 없어(재작성 경로 없음), 중복 지급 자체가
-- 구조적으로 불가능하다 — 별도 가드 불요.

create function public.reward_review_tokens() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
	if length(new.content) < 20 then
		return new;
	end if;

	insert into public.token_wallets (profile_id, balance)
	values (new.author_id, 20)
	on conflict (profile_id) do update
		set balance = public.token_wallets.balance + 20, updated_at = now();

	insert into public.token_ledger (profile_id, amount, reason)
	values (new.author_id, 20, 'review_reward');

	return new;
end;
$$;

create trigger reviews_reward_tokens
	after insert on public.reviews
	for each row execute function public.reward_review_tokens();

-- Stores daily OHLCV bars for Korean stock tickers, replacing the
-- web/src/data/stock-prices.json + git-commit approach.
-- open/high/low/close are whole KRW won amounts, so integer is enough and
-- keeps PostgREST returning them as JSON numbers (numeric would come back
-- as a string). volume is bigint because it can exceed int4 range; the app
-- code converts that string back to a number after reading it.
create table if not exists public.stock_prices (
  ticker text not null,
  date date not null,
  open integer not null,
  high integer not null,
  low integer not null,
  close integer not null,
  volume bigint not null,
  primary key (ticker, date)
);

alter table public.stock_prices enable row level security;
-- No policies are defined: the app and the collection script both use the
-- service role key, which bypasses RLS. Anon/authenticated clients get no
-- access by default.

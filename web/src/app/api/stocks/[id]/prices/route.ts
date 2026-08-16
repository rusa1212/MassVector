import { getStockById } from "@/data/stocks";
import {
  getPublicStockPrices,
  isKoreanStockTicker,
} from "@/lib/publicStockPrices";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const stock = getStockById(id);

  if (!stock || !isKoreanStockTicker(stock.ticker)) {
    return Response.json(
      { error: "조회할 수 없는 국내 종목입니다." },
      { status: 404 },
    );
  }

  try {
    const prices = await getPublicStockPrices(stock.ticker);
    return Response.json({ ...prices, source: "public-data" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "주가 정보를 불러오지 못했습니다.";
    return Response.json({ error: message }, { status: 503 });
  }
}

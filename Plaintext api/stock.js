export const config = {
  runtime: 'edge', 
};

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const stockNo = searchParams.get('stockNo') || '2330'; 

    const twseUrl = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&stockNo=${stockNo}`;

    const twseResponse = await fetch(twseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!twseResponse.ok) {
      throw new Error(`證交所伺服器回應錯誤: ${twseResponse.status}`);
    }

    const data = await twseResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

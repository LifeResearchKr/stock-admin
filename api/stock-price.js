export default async function handler(
  req,
  res
) {
  try {
    const APP_KEY =
      process.env.KIS_APP_KEY;

    const APP_SECRET =
      process.env.KIS_APP_SECRET;

    // 토큰 발급
    const tokenResponse =
      await fetch(
        "https://openapi.koreainvestment.com:9443/oauth2/tokenP",
        {
          method: "POST",
          headers: {
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            grant_type:
              "client_credentials",
            appkey: APP_KEY,
            appsecret:
              APP_SECRET,
          }),
        }
      );

    const tokenData =
      await tokenResponse.json();

    const accessToken =
      tokenData.access_token;

    // 삼성전자 현재가 조회
    const response =
      await fetch(
        "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=005930",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
            appkey: APP_KEY,
            appsecret:
              APP_SECRET,
            tr_id:
              "FHKST01010100",
          },
        }
      );

    const data =
      await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error:
        "현재가 조회 실패",
      detail:
        error.message,
    });
  }
}
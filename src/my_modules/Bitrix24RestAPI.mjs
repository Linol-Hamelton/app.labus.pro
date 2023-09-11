import fetch from "node-fetch";

export default async function Bitrix24Webhook(Webhook, method, order, filter, select) {
  const batchSize = 50;
  const params = {
    order: order,
    filter: filter,
    select: select
  };
  let data = [];
  let needNext = true;
  while (needNext) {
    const url = Webhook + method + "/";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...params,
        count: batchSize,
      }),
    };
    const response = await fetch(url, options);
    const batch = await response.json();
    if (batch.error) {
      throw new Error(batch.error_description);
    }
    data = data.concat(batch.result);
    const next = batch.next;
    if (!next) {
      break;
    }
    const numFetched = next - params.start;
    params.start = next;
    params.count = batchSize - numFetched;
  }

  //console.log(data);
  return data;
}



/*Bitrix24Webhook(
  "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
  "crm.deal.list?id=",
  { ID: "ASC" },
  { STAGE_ID: "WON", ">BEGINDATE": "2023-05-01T03:00:00+04:00" },
  ["*", "DEAL_STAGE", "UF_CRM_1646726252", "UF_CRM_1516479245207"]
);
*/
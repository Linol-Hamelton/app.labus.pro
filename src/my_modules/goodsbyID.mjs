import Bitrix24Webhook from "./Bitrix24RestAPI.mjs";
import curdate from "./CurMonDat.mjs";
import bxPostJson from "./Bitrix24Webhook.mjs";

export default async function goodsbyid(dealID) {
var goodsList = [];
var i = 0;
var { firstDay, lastDay } = await curdate();

var deals = await Bitrix24Webhook(
"https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
"crm.deal.list",
{ ID: "ASC" },
{ STAGE_ID: "WON", ">=CLOSEDATE": firstDay, "<=CLOSEDATE": lastDay },
["ID"]
);

var dealGoodsReq = [];
var dealGoodsReq2 = { halt: 0, cmd: {} };
dealGoodsReq.push(...dealID); // Use spread operator to add all deal IDs
dealGoodsReq2["cmd"] = dealID.reduce((obj, id) => {
obj[id] = "crm.deal.productrows.get?id=" + id;
return obj;
}, {});

var goodsi = await bxPostJson("batch", dealGoodsReq2);

for (var dealIdGoods of dealGoodsReq) {
var dealGoods = goodsi?.result?.result?.[dealIdGoods] || []; // Use optional chaining to handle undefined cases
deals[dealIdGoods] = deals[dealIdGoods] || {}; // Create an empty object if deals[dealIdGoods] is undefined
deals[dealIdGoods]["goods"] = dealGoods;

for (var good of dealGoods) {
  goodsList.push(good);
  i++;
}
}

const filteredData = goodsList.map(
({
OWNER_TYPE,
ORIGINAL_PRODUCT_NAME,
PRICE_EXCLUSIVE,
PRICE_NETTO,
PRICE_BRUTTO,
PRODUCT_DESCRIPTION,
DISCOUNT_TYPE_ID,
DISCOUNT_RATE,
DISCOUNT_SUM,
TAX_RATE,
TAX_INCLUDED,
CUSTOMIZED,
MEASURE_CODE,
MEASURE_NAME,
SORT,
XML_ID,
TYPE,
STORE_ID,
RESERVE_ID,
DATE_RESERVE_END,
RESERVE_QUANTITY,
...rest
}) => rest
);

var GoodsList = filteredData.map(({ ID, OWNER_ID, ...rest }) => ({
GOOD_ID: ID,
ID: OWNER_ID,
...rest
}));

return GoodsList;
}
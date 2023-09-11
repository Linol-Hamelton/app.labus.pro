import b24 from "./b24_deals_data.mjs";
import goodsbyid from "./goodsbyID.mjs";
import getGoods from "./price_list.mjs";

console.time("codeExecution");

export default async function Report() {
  const deals = await b24();
  const dealID = deals.map((deal) => deal.ID);
  const goodsList = await goodsbyid(dealID);
  const goodID = goodsList.map((good) => good.PRODUCT_ID);
  const filtGoodID = goodID.filter((id) => id !== 0);
  const priceList = await getGoods(filtGoodID);
  const filteredList = priceList.filter((item) => typeof item !== "number");

  const mergedArray = [];

  deals.forEach((deal) => {
    const matchingGoods = goodsList.filter((goods) => goods.ID === deal.ID);

    if (matchingGoods.length === 0) {
      mergedArray.push(deal);
    } else {
      matchingGoods.forEach((goods) => {
        const mergedItem = { ...deal, ...goods };
        mergedItem.ID = deal.ID; // Set ID value to the deal's ID
        mergedArray.push(mergedItem);
      });
    }
  });

  const mergedResult = [];

  mergedArray.forEach((mergedItem) => {
    if (mergedItem.PRODUCT_ID !== undefined) {
      const matchingItems = filteredList.filter(
        (filterItem) => filterItem.ID === mergedItem.PRODUCT_ID.toString()
      );

      if (matchingItems.length === 0) {
        mergedResult.push(mergedItem);
      } else {
        matchingItems.forEach((matchingItem) => {
          const mergedResultItem = { ...mergedItem, ...matchingItem };
          mergedResultItem.ID = mergedItem.ID; // Set ID value to the original deal's ID
          mergedResult.push(mergedResultItem);
        });
      }
    }
  });

  const formattedResult = mergedResult.map((item) => {
    const formattedItem = { ...item };
    for (const key in formattedItem) {
      if (
        Object.prototype.hasOwnProperty.call(formattedItem, key) &&
        formattedItem[key] &&
        typeof formattedItem[key] === "object" &&
        formattedItem[key].hasOwnProperty("value")
      ) {
        formattedItem[key] = formattedItem[key].value;
      }
    }
    return formattedItem;
  });

  console.log(formattedResult);
  console.timeEnd("codeExecution");
  return formattedResult;
}

await Report();

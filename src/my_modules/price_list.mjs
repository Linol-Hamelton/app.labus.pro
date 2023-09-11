import bxPostJson from "./Bitrix24Webhook.mjs";

export default async function getGoods(goods_list) {
  var goods = new Array();
  if (goods_list.length > 0) {
    var params = {
      filter: { ID : goods_list, ACTIVE: 'Y' },
      select: [ 'ID', 'NAME', 'CATALOG_ID', 'SECTION_ID:', 'PRICE', 'PROPERTY_478', 'PROPERTY_480', 'PROPERTY_570', 'PROPERTY_574' ]
    };
    var need_next = true;
    while (need_next) {
      var result = await bxPostJson("crm.product.list", params);
      if (typeof result.next !== 'undefined') {
        need_next = true;
        params.start = result.next;
      } else {
        need_next = false;
      }
      var conts = result['result'];
      if (Array.isArray(conts)) { // Check if conts is an array
        for (var cont of conts) {
          // Change the property name from "PRICE" to "BASE_PRICE"
          cont.BASE_PRICE = cont.PRICE;
          delete cont.PRICE;
          goods[cont.ID] = cont;
        }
      }
    }
    
    return goods;
  }
}


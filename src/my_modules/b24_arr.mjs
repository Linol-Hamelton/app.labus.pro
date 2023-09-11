import Bitrix24Webhook from "./Bitrix24RestAPI.mjs";
import curdate from "./CurMonDat.mjs";

async function b24() {
  console.time('codeExecution');
  var { firstDay, lastDay } = await curdate();

  var users = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "user.get?id=",
    { ID: "ASC" },
    { ACTIVE: true },
    [ "ID", "NAME" ],
  );

  var companies = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "crm.company.list?id=",
    { ID: "ASC" },
    {},
    [ "ID", "TITLE" ],
  );

  var contacts = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "crm.contact.list?id=",
    { ID: "ASC" },
    {},
    ["ID", "NAME"],
  );

  var deals = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "crm.deal.list?id=",
    { ID: "ASC" },
    { STAGE_ID: "WON", ">=BEGINDATE": firstDay, "<=CLOSEDATE": lastDay },
    [ "ID", "COMPANY_ID", "STAGE_ID", "CONTACT_ID", "BEGINDATE", "CLOSEDATE", "ASSIGNED_BY_ID", "MODIFY_BY_ID", "UF_CRM_1646726252", "UF_CRM_1516479245207", "UF_CRM_1684069704806", "UF_CRM_1684069832365" ],
  );

 
  const userLookup = {};
  const companyLookup = {};
  const contactLookup = {};
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    userLookup[user.ID] = user.ID;
  }
  
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    companyLookup[company.ID] = company.TITLE;
  }
  
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contactLookup[contact.ID] = contact.NAME;
  }

  for (let i = 0; i < deals.length; i++) {
    const deal = deals[i];
  
    if (deal.ASSIGNED_BY_ID) {
      const user = userLookup[deal.ASSIGNED_BY_ID];
      if (user) {
        deal.ASSIGNED_BY_ID = user.NAME + " " + user.LAST_NAME;
      }
    }
  
    if (deal.CREATED_BY_ID) {
      const user = userLookup[deal.CREATED_BY_ID];
      if (user) {
        deal.CREATED_BY_ID = user.NAME + " " + user.LAST_NAME;
      }
    }
  
    if (deal.MODIFY_BY_ID) {
      const user = userLookup[deal.MODIFY_BY_ID];
      if (user) {
        deal.MODIFY_BY_ID = user.NAME + " " + user.LAST_NAME;
      }
    }
  
    if (deal.LAST_ACTIVITY_BY) {
      const user = userLookup[deal.LAST_ACTIVITY_BY];
      if (user) {
        deal.LAST_ACTIVITY_BY = user.NAME + " " + user.LAST_NAME;
      }
    }
  
    if (deal.MOVED_BY_ID) {
      const user = userLookup[deal.MOVED_BY_ID];
      if (user) {
        deal.MOVED_BY_ID = user.NAME + " " + user.LAST_NAME;
      }
    }
  
    if (deal.UF_CRM_1646726252) {
      const user = userLookup[deal.UF_CRM_1646726252];
      if (user) {
        deal.UF_CRM_1646726252 = user.NAME + " " + user.LAST_NAME;
      }
    }
  
    if (deal.COMPANY_ID) {
      const company = companyLookup[deal.COMPANY_ID];
      if (company) {
        deal.COMPANY_ID = company;
      }
    }
  
    if (deal.CONTACT_ID) {
      const contact = contactLookup[deal.CONTACT_ID];
      if (contact) {
        deal.CONTACT_ID = contact;
      }
    }
  }
  console.log(deals);
  console.timeEnd('codeExecution');
  return deals;
}

await b24();
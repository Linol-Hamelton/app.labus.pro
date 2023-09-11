import Bitrix24Webhook from "./Bitrix24RestAPI.mjs";
import curdate from "./CurMonDat.mjs";

export default async function b24() {

  var { firstDay, lastDay } = await curdate();

  var deals = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "crm.deal.list",
    { ID: "ASC" },
    { STAGE_ID: "WON", ">=CLOSEDATE": firstDay, "<=CLOSEDATE": lastDay },
    [ "ID", "TITLE", "STAGE_SEMANTIC_ID", "OPPORTUNITY", "IS_MANUAL_OPPORTUNITY", "COMPANY_ID", "CONTACT_ID", "BEGINDATE", "CLOSEDATE", "ASSIGNED_BY_ID", "MODIFY_BY_ID", "UF_CRM_1646726252", "UF_CRM_1516479245207", "UF_CRM_1684069704806", "UF_CRM_1684069832365" ]
  );

  if (!deals) {
    console.log("Error: Unable to retrieve deals. 'deals' is undefined.");
    return;
  }

  var dealID = deals.map((deal) => deal.ID);
  var companyID = deals.map((deal) => deal.COMPANY_ID);
  var contactID = deals.map((deal) => deal.CONTACT_ID);

  var companies = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "crm.company.list",
    { ID: "ASC" },
    { ID: companyID },
    ["ID", "TITLE"]
  );

  if (!companies) {
    console.log("Error: Unable to retrieve companies. 'companies' is undefined.");
    return;
  }

  var companyLookup = {};
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    companyLookup[company.ID] = company.TITLE;
  }

  var contacts = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "crm.contact.list",
    { ID: "ASC" },
    { ID: contactID },
    ["ID", "NAME"]
  );

  if (!contacts) {
    console.log("Error: Unable to retrieve contacts. 'contacts' is undefined.");
    return;
  }

  var contactLookup = {};
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contactLookup[contact.ID] = contact.NAME;
  }

  var users = await Bitrix24Webhook(
    "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/",
    "user.get",
    { ID: "ASC" },
    { ACTIVE: true },
    ["ID", "NAME"]
  );

  var userLookup = {};
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    userLookup[user.ID] = user.NAME;
  }

  for (let i = 0; i < deals.length; i++) {
    const deal = deals[i];

    if (deal.ASSIGNED_BY_ID) {
      const user = userLookup[deal.ASSIGNED_BY_ID];
      if (user) {
        deal.ASSIGNED_BY_ID = user;
      }
    }

    if (deal.MODIFY_BY_ID) {
      const user = userLookup[deal.MODIFY_BY_ID];
      if (user) {
        deal.MODIFY_BY_ID = user;
      }
    }

    if (deal.UF_CRM_1646726252) {
      const user = userLookup[deal.UF_CRM_1646726252];
      if (user) {
        deal.UF_CRM_1646726252 = user;
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

  return deals;
}


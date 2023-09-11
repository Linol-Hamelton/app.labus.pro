import fetch from "node-fetch";

export default async function bxPostJson(method, params) {
    const url =
        "https://labus.bitrix24.ru/rest/5/a184a56co9ghrehs/" + method + "/";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    };
    const response = await fetch(url, options);
    const result = await response.json();
    if (result.error) {
        throw new Error(result.error_description);
    }
    return result;
}
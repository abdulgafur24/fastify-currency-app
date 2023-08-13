import { AppDataSource } from "../data-source";
import { Currency } from "../modules/currencies/entity";
import Parser from "rss-parser";

AppDataSource.initialize()
  .then(() => {
    let parser = new Parser();

    (async () => {
      let rates = await parser.parseURL(
        "https://www.nationalbank.kz/rss/rates_all.xml"
      );

      const items = rates.items.map(({ title, content }) => ({
        name: title,
        rate: content,
      }));

      await AppDataSource.getRepository(Currency).upsert(items, ["name"]);

      console.log(items);
      console.log("Updated");
    })();
  })
  .catch((error) => console.log(error));

const fs = require("fs").promises;
const marked = require("marked");

async function buildData() {
  const files = await fs.readdir("./src/wiki");

  const searchData = [];

  for (const page of files) {
    if (page !== "index.md") {
      const [path] = page.split(".");

      let data = await fs.readFile(`./src/wiki/${page}`, "utf8");

      const [meta, body] = data.split("@@@");

      // Convert Meta tags to object
      const metaObj = meta.split(/\n/).reduce((acc, el) => {
        if (el.length) {
          const [key, value] = el.split("=");
          acc[key] = value?.trim();
        }
        return acc;
      }, {});

      // Add to searchData
      searchData.push({
        title: `${metaObj.title}`,
        content: `${body}`,
        url: `https://wiki.jonathan-cox.dev/${path}.html`,
      });
    }
  }

  // Write searchData.js to file
  await fs.writeFile(
    `./src/searchData.js`,
    `export const data = ${JSON.stringify(searchData)};`
  );
}

buildData();

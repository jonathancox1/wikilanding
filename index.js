const fs = require("fs").promises;
const marked = require("marked");

const siteName = "wiki.jonathan-cox.dev";
const baseUrl = "https://wiki.jonathan-cox.dev";
const [today] = new Date().toISOString().split("T");
const sitemap = [];
const searchData = [];

async function build() {
  const files = await fs.readdir("./src/wiki");

  // Generate SiteMap Links to each page
  let linkBlock = `
  `;

  for (const page of files) {
    if (page !== "assets" && page !== "index.md") {
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

      // Generate links to each article
      linkBlock += `[${metaObj.title}](https://wiki.jonathan-cox.dev/${path}.html)  
		`;

      // Add to searchData
      searchData.push({
        title: `${metaObj.title}`,
        content: `${body}`,
        url: `https://wiki.jonathan-cox.dev/${path}.html`,
      });
    }
  }

  for (const file of files) {
    if (file !== "assets") {
      // Take first part of file name for html name (this will be the url)
      const [path] = file.split(".");

      // Read Markdown and generate HTML
      let data = await fs.readFile(`./src/wiki/${file}`, "utf8");

      // Generate links to each article
      if (path === "index") {
        data += linkBlock;

        addToIndex(data);
        continue;
      }

      const html = generateHtml(data, path);

      // Write HTML to file
      await fs.writeFile(`./build/${path}.html`, html);
    }
  }

  // Write sitemap.xml to file
  await fs.writeFile(
    `./build/sitemap.xml`,
    [
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.google.com/schemas/sitemap/0.84 https://www.google.com/schemas/sitemap/0.84/sitemap.xsd">',
      ...sitemap,
      "</urlset>",
    ].join("")
  );
}

async function addToIndex(data) {
  // Read Markdown and generate HTML
  let reactIndex = await fs.readFile("./build/index.html", "utf8");

  const indexOfRoot = reactIndex.indexOf('<div id="root"></div>');

  const firstHalf = reactIndex.slice(0, indexOfRoot);

  const root = '<div id="root"></div>';

  const secondHalf = "</body></html>";

  let [_, markdown] = data.split("@@@");

  const parsed = marked.parse(markdown);

  const html = firstHalf + root + parsed + secondHalf;

  await fs.writeFile("./build/index.html", html);
}

function generateHtml(data, path) {
  let [meta, markdown] = data.split("@@@");

  // Convert Meta tags to object
  const metaObj = meta.split(/\n/).reduce((acc, el) => {
    if (el.length) {
      const [key, value] = el.split("=");
      acc[key] = value?.trim();
    }
    return acc;
  }, {});
  metaObj.url = `${baseUrl}/${path}.html`;

  // Generte meta tags and HTML
  const metaTags = generateMetaTags(metaObj);

  // Add Back link
  if (path !== "index") {
    markdown = "[<- back](https://wiki.jonathan-cox.dev)" + markdown;
  }

  const parsed = marked.parse(markdown);

  // Push articles to sitemap
  sitemap.push(
    `<url><loc>${metaObj.url || ""}</loc><lastmod>${
      metaObj.date || today
    }</lastmod></url>`
  );

  return `
		<!DOCTYPE html>
		<html lang="en">
		${metaTags}
		<link rel="stylesheet" href="assets/style.css">
		<title>${metaObj.title}</title>
		</head>
		<body>${parsed}</body>
		</html>
	`;
}

function generateMetaTags({ description, image, title, url }) {
  // Create meta tags for social links
  const baseMeta = `
		<!-- Base meta tags -->
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="description" content="${description || ""}" />
		<meta name="language" content="english" />
		<meta name="title" content="${title || ""}" />
		<meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1.0, user-scalable=2">	
	`;
  const openGraph = `
		<!-- OpenGraph -->
		<meta property="og:description" content="${description || ""}" />
		<meta property="og:image" content="${image}" />
		<meta property="og:site_name" content="${siteName || ""}" />
		<meta property="og:title" content=${title || ""} />
		<meta property="og:type" content="article" />
		<meta property="og:url" content="${url || ""}" />
	`;
  const twitter = `
		<!-- Twitter -->
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:description" content="${description || ""}" />
		<meta name="twitter:image" content="${image || ""}" />
		<meta name="twitter:title" content="${title || ""}" />
	`;
  return baseMeta + openGraph + twitter;
}
build();

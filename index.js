const puppeteer = require("puppeteer");
const config = require("config");
const login = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1280, height: 900 },
  });
  const page = await browser.newPage();
  await page.goto("https://fyntunesol.greythr.com/");
  try {
    await page.waitForSelector(".sidebar");
    await page.$eval("input", (el) => el.focus());
    await page.keyboard.type(config.get("username"));
    await page.keyboard.press("Tab");
    await page.keyboard.type(config.get("password"));
    await page.keyboard.press("Enter");
    await page.waitForSelector(".home-dashboard");
    await page.waitForSelector(".btn");
    await page.$eval(".btn", (el) => el.click());
  } catch (error) {
    console.log(error);
  }
  await page.screenshot({ path: "result.png" });

  await browser.close();
};

login();

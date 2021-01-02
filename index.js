const puppeteer = require("puppeteer");
const config = require("config");

const schedule = require("node-schedule");
const fs = require("fs");

const checkArguments = async () => {
  const args = process.argv;
  var dir = __dirname + "/config";

  if (!fs.existsSync(dir)) {
    fs.mkdir(__dirname + "/config", (err) => {
      if (err) console.log(err);
    });
  }
  if (args.includes("--user") && !args.includes("--password")) {
    console.log("Please provide password along with user");
    process.exit();
  }
  if (!args.includes("--user") && args.includes("--password")) {
    console.log("Please provide user along with password");
    process.exit();
  }
  if (args.includes("--user") && args.includes("--password")) {
    let user = args.indexOf("--user");
    let password = args.indexOf("--password");
    if (user > 0 && password > 0) {
      let credentials = {
        username: args[user + 1],
        password: args[password + 1],
      };
      fs.writeFileSync(
        __dirname + "/config/default.json",
        JSON.stringify(credentials),
        (err) => {
          if (err) console.log(err);
          process.exit();
        }
      );
      console.log("Your credentials are saved! ");
      console.log('Run "node index.js" to automate');
      process.exit();
    }
  }
};
checkArguments();
const automate = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1280, height: 900 },
  });
  const page = await browser.newPage();
  await page.goto("https://fyntunesol.greythr.com/");
  var x = "";
  try {
    await page.waitForSelector(".sidebar");
    await page.$eval("input", (el) => el.focus());
    await page.keyboard.type(config.get("username"));
    await page.keyboard.press("Tab");
    await page.keyboard.type(config.get("password"));
    await page.keyboard.press("Enter");
    await page.waitForSelector(".home-dashboard");
    await page.waitForSelector(".btn");
    x = await page.$eval(".btn", (el) => {
      el.click();
      return el.innerText;
    });
  } catch (error) {
    console.log(error);
  }
  await page.screenshot({ path: "result.png" });

  await browser.close();
  return x;
};
const date = new Date();
const checkLate = async () => {
  if (process.argv.includes("--late")) {
    let inner = await automate();
    fs.appendFile(
      "log.txt",
      `\n ${inner} at ${date.getHours()}:${date.getMinutes()} on ${date.getDate()}/${date.getMonth()}`,
      (e) => {
        if (e) {
          console.log(e);
        }
      }
    );
    console.log("Signed in late");
  }
};
checkLate();

console.log("Waiting", date.getHours() >= 9 ? "for sign out" : "for sign in");
if (
  date.getDay() === 7 ||
  (date.getDay() === 6 && Math.floor((date.getDate() - 1) / 7) % 2)
) {
  process.exit();
}
var signIn = schedule.scheduleJob({ hour: 09, minute: 00 }, async () => {
  let inner = await automate();
  fs.appendFile(
    "log.txt",
    `\n ${inner} at ${date.getHours()}:${date.getMinutes()} on ${date.getDate()}/${date.getMonth()}`,
    (e) => {
      if (e) {
        console.log(e);
      }
    }
  );
});
var signOut = schedule.scheduleJob({ hour: 19, minute: 00 }, async () => {
  let inner = await automate();
  fs.appendFile(
    "log.txt",
    `\n ${inner} at ${date.getHours()}:${date.getMinutes()} on ${date.getDate()}/${date.getMonth()}`,
    (e) => {
      if (e) {
        console.log(e);
      }
    }
  );
});

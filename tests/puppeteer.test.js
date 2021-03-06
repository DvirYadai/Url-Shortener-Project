const puppeteer = require("puppeteer");
const app = require("../app");

const url = "http://localhost:3000/";
let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 50,
  });
  page = await browser.newPage();

  await page.goto(url);
});

afterAll(async () => {
  await browser.close();
});

jest.setTimeout(20000);

describe("FrontEnd Tests", () => {
  test("If the user enter invalid url an error appears", async () => {
    await page.type("input#url_input", "https://www.freecodecamp.o");
    await page.click("input#url-submit-button");
    let errorInnerText = await page.$eval("div#error-url", (input) => input);
    expect(errorInnerText).toBe("Invalid Url!");
  });

  //   test("If the user enter url that doesn't exist an error appears", async () => {
  //     await page.click("input#url_input");
  //     // for (let i = 0; i < 26; i++) {
  //     //   await page.keyboard.press("Backspace");
  //     // }
  //     await page.type("input#url_input", "https://www.freecosadasdecamp.org");
  //     await page.click("input#url-submit-button");
  //     let errorInnerText = await page.$eval(
  //       "div#error-url",
  //       (input) => input.innerText
  //     );
  //     expect(errorInnerText).toBe("This url does not exist!");
  //   });
});

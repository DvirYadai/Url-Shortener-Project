const errorUrl = document.getElementById("error-url");
const errorShortUrl = document.getElementById("error-shortened-url");
const errorNewShortUrl = document.getElementById("error-new-shortened-url");
const newShortUrlP = document.getElementById("new-short-url");
const shortUrlAnchor = document.getElementById("short-url-anchor");
const statisticDiv = document.getElementById("statistic");
const creationTimeP = document.getElementById("creation-time");
const originalUrlP = document.getElementById("original-url");
const redirectCountP = document.getElementById("redirect-count");
const shorturlIdP = document.getElementById("shorturl-id");

document
  .getElementById("url-submit-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let inputValue = document.getElementById("url_input").value;
    if (inputValue === "") {
      errorUrl.hidden = false;
      errorUrl.innerText = "You must enter url!";
      return;
    }
    let inputCustomShortUrlValue = document.getElementById(
      "shortened_url_input_option"
    ).value;
    newShortUrlP.hidden = true;
    errorUrl.hidden = true;
    errorNewShortUrl.hidden = true;
    await postNewUrl(inputValue, inputCustomShortUrlValue);
  });

document
  .getElementById("shortened-submit-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let inputValue = document.getElementById("shortened_url_input").value;
    if (inputValue === "") {
      errorShortUrl.hidden = false;
      errorShortUrl.innerText = "You must enter short url!";
      return;
    }
    errorShortUrl.hidden = true;
    await GetSpecificUrlStatistic(inputValue);
  });

function showInput() {
  document.getElementById("shortened_url_input_option").hidden = false;
}

function hideStatistic() {
  statisticDiv.hidden = true;
}

async function postNewUrl(url, inputCustomShortUrlValue) {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:3000/api/shorturl`,
      data: {
        url: url,
        customShortUrl: inputCustomShortUrlValue,
      },
    });
    document.getElementById("shortened_url_input_option").value = "";
    document.getElementById("shortened_url_input_option").hidden = true;
    if (res.data.length) {
      newShortUrlP.hidden = false;
      shortUrlAnchor.innerText = `http://localhost:3000/api/shorturl/${res.data[0]["shorturl-id"]}`;
      shortUrlAnchor.setAttribute(
        "href",
        `http://localhost:3000/api/shorturl/${res.data[0]["shorturl-id"]}`
      );
      return;
    }
    newShortUrlP.hidden = false;
    shortUrlAnchor.innerText = `http://localhost:3000/api/shorturl/${res.data["shorturl-id"]}`;
    shortUrlAnchor.setAttribute(
      "href",
      `http://localhost:3000/api/shorturl/${res.data["shorturl-id"]}`
    );
  } catch (error) {
    switch (error.response.data) {
      case "Invalid Url!":
        errorUrl.hidden = false;
        errorUrl.innerText = "Invalid Url!";
        break;

      case "This url does not exist!":
        errorUrl.hidden = false;
        errorUrl.innerText = "This url does not exist!";
        break;

      case "Invalid shortened url format!":
        errorNewShortUrl.hidden = false;
        errorNewShortUrl.innerText = "Invalid shortened url format!";
        break;

      case "Short url is already in use!":
        errorNewShortUrl.hidden = false;
        errorNewShortUrl.innerText = "Short url is already in use!";
        break;
    }
  }
}

async function GetSpecificUrlStatistic(url) {
  try {
    const res = await axios({
      method: "GET",
      url: `http://localhost:3000/api/statistic/${url}`,
    });
    errorShortUrl.hidden = true;
    statisticDiv.hidden = false;
    creationTimeP.innerText = `Creation Date: ${res.data.creationDate}`;
    originalUrlP.innerText = `Original Url: ${res.data.originalUrl}`;
    redirectCountP.innerText = `Redirect Count: ${res.data.redirectCount}`;
    shorturlIdP.innerText = `Short Url Id: ${res.data["shorturl-id"]}`;
  } catch (error) {
    errorShortUrl.hidden = false;
    switch (error.response.data) {
      case "Invalid shortened url format!":
        errorShortUrl.innerText = "Invalid shortened url format!";
        break;

      case "There is no such short url!":
        errorShortUrl.innerText = "There is no such short url!";
        break;
    }
  }
}

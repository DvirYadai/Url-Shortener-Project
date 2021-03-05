document
  .getElementById("url-submit-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let inputValue = document.getElementById("url_input").value;
    let inputCustomShortUrlValue = document.getElementById(
      "shortened_url_input_option"
    ).value;
    await postNewUrl(inputValue, inputCustomShortUrlValue);
    document.getElementById("url_input").value = "";
    document.getElementById("shortened_url_input_option").value = "";
    document.getElementById("shortened_url_input_option").hidden = true;
  });

document
  .getElementById("shortened-submit-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let inputValue = document.getElementById("shortened_url_input").value;
    await GetSpecificUrlStatistic(inputValue);
    document.getElementById("url_input").value = "";
  });

function showInput() {
  document.getElementById("shortened_url_input_option").hidden = false;
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
    if (res.data.length) {
      console.log(res.data[0]);
      return;
    }
    console.log(res.data);
  } catch (error) {
    console.log(error.response.data);
  }
}

async function GetSpecificUrlStatistic(url) {
  try {
    const res = await axios({
      method: "GET",
      url: `http://localhost:3000/api/statistic/${url}`,
    });
    console.log(res.data);
  } catch (error) {
    console.log(error.response.data);
  }
}

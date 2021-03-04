document
  .getElementById("url-submit-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let inputValue = document.getElementById("url_input").value;
    await postNewUrl(inputValue);
    document.getElementById("url_input").value = "";
  });

document
  .getElementById("shortened-submit-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let inputValue = document.getElementById("shortened_url_input").value;
    await GetSpecificUrlStatistic(inputValue);
    document.getElementById("url_input").value = "";
  });

async function postNewUrl(url) {
  try {
    const res = await axios({
      method: "POST",
      url: `http://localhost:3000/api/shorturl`,
      data: {
        url: url,
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

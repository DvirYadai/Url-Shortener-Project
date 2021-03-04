document
  .getElementById("submit-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const inputValue = document.getElementById("url_input").value;
    await postNewUrl(inputValue);
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
    console.log(res.data[0]);
  } catch (error) {
    console.log(error.response.data);
  }
}

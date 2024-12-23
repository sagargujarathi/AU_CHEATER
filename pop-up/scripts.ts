import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENT SELECTION
  const submitButton = document.getElementById(
    "submit-button"
  ) as HTMLButtonElement;
  const inputSecretKey = document.getElementById(
    "input-secret-key"
  ) as HTMLInputElement;

  const configurationForm = document.getElementById(
    "configuration-form"
  ) as HTMLFormElement;

  //   --------------------------------------------------------------

  const verifySecretKey = (key: string) =>
    axios
      .get("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      })
      .then(() => true)
      .catch(() => false);

  const handleSubmit = async (event: SubmitEvent) => {
    // STOP REFRESHING PAGE
    event.preventDefault();
    console.log(event);
    const key = inputSecretKey.value;

    submitButton.textContent = "Loading...";
    submitButton.disabled = true;

    const isValid = await verifySecretKey(key);

    if (isValid) {
      console.log("valid");
    } else console.log("Not valid");

    submitButton.textContent = "Submit";
    submitButton.disabled = false;
  };

  // EVENT LISTENERS STARTS HERE

  configurationForm.addEventListener("submit", handleSubmit);
});

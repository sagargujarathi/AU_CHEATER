import { KEY_TYPES } from "@/constants";
import { extractDataFromUrl, generateAnswer, getExamDetails } from "@/helpers";

let PROMPT_DETAILS = {
  isGenerated: false,
  questionNumber: -1,
  optionId: "",
  section: "",
};

const loadScripts = async () => {
  const { BASE_URL, ATTEMPT_ID } = extractDataFromUrl();

  const CONFIGURATION_DATA = await chrome.storage.local.get([
    KEY_TYPES.GENERATE_KEY,
    KEY_TYPES.AUTO_SELECT_KEY,
  ]);

  const EXAM_DATA = await getExamDetails(BASE_URL, ATTEMPT_ID);

  // CHECK IF WE GOT DATA
  if (!ATTEMPT_ID || !EXAM_DATA) return;

  window.addEventListener("keypress", async (event) => {
    const key = event.key.toUpperCase();

    const questionText =
      (document.getElementsByClassName("question-heading")[0] as HTMLDivElement)
        ?.textContent || "";

    const section =
      document
        .querySelector(".sidebar-brand-2")
        ?.textContent?.replace("Section", "")
        .trim() || "";

    const questionNumber = Number(
      questionText.match(/Ques (\d+) /)?.[1] || "0"
    );

    //  THIS GENERATES THE ANSWER FOR THE QUESTION
    if (key == CONFIGURATION_DATA.GENERATE_KEY) {
      console.log("SECTION: ", section);
      console.log("QUESTION NUMBER: ", questionNumber);

      const option = await generateAnswer(
        EXAM_DATA.find((item) => item.name === section)?.questions?.[
          questionNumber - 1
        ] || {}
      );

      if (!option) return;

      PROMPT_DETAILS = {
        isGenerated: true,
        questionNumber: questionNumber,
        optionId: option,
        section,
      };
    }

    // THIS AUTO CHECKS THE OPTION AFTER GENERATING THE ANSWER
    if (key === CONFIGURATION_DATA.AUTO_SELECT_KEY) {
      if (
        PROMPT_DETAILS.questionNumber === questionNumber &&
        PROMPT_DETAILS.isGenerated
      ) {
        PROMPT_DETAILS.optionId.split(", ").map((item) => {
          const input = document.querySelector(
            `input[value=${item.replace('"', "")}]`
          ) as HTMLInputElement;

          input.click();
        });
      }
    }
  });
};

const initListeners = () => {
  console.log("URL UPDATE DETECTED");

  const documentBody = document.body;

  documentBody.onselectstart = null;
  document.onselectstart = null;

  documentBody.oncopy = null;
  documentBody.oncut = null;

  documentBody.onpaste = null;

  document.oncontextmenu = null;
  documentBody.oncontextmenu = null;

  document.onkeydown = null;
  documentBody.onkeydown = null;

  document.onkeyup = null;
  documentBody.onkeyup = null;

  window.onfocus = null;
  document.onfocus = null;

  window.onblur = null;
  document.onblur = null;

  document.onvisibilitychange = null;

  window.onpagehide = null;
  window.onpageshow = null;

  const securityScripts = document.querySelector(
    `script[src="${"https://demo.proctoring.online/sdk/supervisor.js"}"]`
  ) as HTMLScriptElement;
  const playerScripts = document.querySelector(
    `script[src="${"https://player.vimeo.com/api/player.js"}"]`
  ) as HTMLScriptElement;

  const scripts = document.querySelector(
    `script[src="${"polyfills-es2015.aa74eb7c80e33db4c40e.js"}"]`
  ) as HTMLScriptElement;

  securityScripts.remove();
  playerScripts.remove();
  scripts.remove();

  loadScripts();
};

let PREVIOUS_HREF = "";

setInterval(() => {
  if (window.location.href === PREVIOUS_HREF) return;

  PREVIOUS_HREF = window.location.href;

  initListeners();
}, 500);

// DEVELOPED BY SAGAR GUJARATHI :D
// READ THE TERMS AND CONDITIONS BEFORE USING THIS EXTENSION

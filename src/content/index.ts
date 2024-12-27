import {
  extractDataFromUrl,
  generateAnswer,
  getExamDetails,
  getLocalStorageData,
} from "@/helpers";

let PROMPT_DETAILS = {
  isGenerated: false,
  questionNumber: -1,
  optionId: "",
  section: "",
};

const loadScripts = async () => {
  const { BASE_URL, ATTEMPT_ID } = extractDataFromUrl();

  const CONFIGURATION_DATA = await getLocalStorageData();

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
        CONFIGURATION_DATA.SECRET_KEY,
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

document.body.onselectstart = null;
document.onselectstart = null;

document.body.oncopy = null;
document.body.oncut = null;

document.body.onpaste = null;

document.oncontextmenu = null;
document.body.oncontextmenu = null;

document.onkeydown = null;
document.body.onkeydown = null;

document.onkeyup = null;
document.body.onkeyup = null;

const securityScripts = document.querySelector(
  `script[src="${"https://demo.proctoring.online/sdk/supervisor.js"}"]`
) as HTMLScriptElement;
const playerScripts = document.querySelector(
  `script[src="${"https://player.vimeo.com/api/player.js"}"]`
) as HTMLScriptElement;

const scripts = document.querySelector(
  `script[src="${"polyfills-es2015.aa74eb7c80e33db4c40e.js"}"]`
) as HTMLScriptElement;

window.onfocus = null;
document.onfocus = null;
window.onblur = null;
document.onblur = null;
document.onvisibilitychange = null;
window.onpagehide = null;
window.onpageshow = null;

securityScripts.remove();
playerScripts.remove();
scripts.remove();

loadScripts();

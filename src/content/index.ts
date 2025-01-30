import { KEY_TYPES } from "@/constants";
import { extractDataFromUrl, generateAnswer, getExamDetails } from "@/helpers";
import { IPromptDetails } from "@/types";

let PROMPT_DETAILS: IPromptDetails = {
  isGenerated: false,
  isGenerating: false,
  questionNumber: -1,
  optionId: "",
  section: "",
};

interface QuestionMetadata {
  number: number;
  section: string;
  text: string;
}

const extractQuestionData = (): QuestionMetadata | null => {
  try {
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

    return {
      number: questionNumber,
      section,
      text: questionText,
    };
  } catch (error) {
    console.error("Error extracting question data:", error);
    return null;
  }
};

const handleGenerateAnswer = async (
  questionData: QuestionMetadata,
  examData: any
) => {
  // Return if already generating or generated for this question
  if (PROMPT_DETAILS.isGenerating || 
      (PROMPT_DETAILS.isGenerated && 
       PROMPT_DETAILS.questionNumber === questionData.number)) {
    return;
  }

  // Set generating state
  PROMPT_DETAILS = {
    isGenerating: true,
    isGenerated: false,
    questionNumber: questionData.number,
    optionId: "",
    section: questionData.section,
  };

  const sectionData = examData.find(
    (item: any) => item.name === questionData.section
  );
  const question = sectionData?.questions?.[questionData.number - 1];

  if (!question) {
    PROMPT_DETAILS.isGenerating = false;
    return;
  }

  const option = await generateAnswer(question);

  PROMPT_DETAILS = {
    isGenerated: !!option,
    isGenerating: false,
    questionNumber: questionData.number,
    optionId: option || "",
    section: questionData.section,
  };
};

const handleAutoSelect = (questionData: QuestionMetadata) => {
  if (
    PROMPT_DETAILS.questionNumber === questionData.number &&
    PROMPT_DETAILS.isGenerated
  ) {
    PROMPT_DETAILS.optionId.split(", ").forEach((item) => {
      const input = document.querySelector(
        `input[value=${item.replace('"', "")}]`
      ) as HTMLInputElement;

      if (input) input.click();
    });
  }
};

const handleKeyPress = async (
  event: KeyboardEvent,
  config: any,
  examData: any
) => {
  const key = event.key.toUpperCase();
  const questionData = extractQuestionData();

  if (!questionData) return;

  // Return if already processing this question
  if (PROMPT_DETAILS.questionNumber === questionData.number) {
    if (PROMPT_DETAILS.isGenerating) return;
    if (PROMPT_DETAILS.isGenerated && key === config[KEY_TYPES.GENERATE_KEY]) return;
  }

  if (key === config[KEY_TYPES.GENERATE_KEY]) {
    await handleGenerateAnswer(questionData, examData);
  } else if (key === config[KEY_TYPES.AUTO_SELECT_KEY] && 
             PROMPT_DETAILS.isGenerated && 
             PROMPT_DETAILS.questionNumber === questionData.number) {
    handleAutoSelect(questionData);
  }
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

  window.addEventListener("keypress", (event) =>
    handleKeyPress(event, CONFIGURATION_DATA, EXAM_DATA)
  );
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

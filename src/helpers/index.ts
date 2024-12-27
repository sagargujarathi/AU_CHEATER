import { INSTACKS_GET_EXAM_DETAILS_API, KEY_TYPES } from "@/constants";
import { IGetExamDetailsAPIResponseType, IStorageType } from "@/types";
import axios from "axios";

const SYSTEM_PROMPT =
  "Given the following question and options, return only the id of the correct option. Do not include any other information or explanations. if no option matches or any issue return null";
export const removePTag = (str: string) =>
  str.replace("<p>", "").replace("</p>", "");

export const generateAnswer = async (apiKey: string, questionData: object) => {
  const data = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: SYSTEM_PROMPT + " " + JSON.stringify(questionData),
      },
    ],
  };

  const response = await axios
    .post("https://api.eduide.cc/v1/chat/completions", data)
    .catch((error) => {
      console.error("Error:", error);
    });

  return response?.data?.choices?.[0]?.message?.content;
};

export const getLocalStorageData = async () => {
  const data = (await chrome.storage.local.get([
    KEY_TYPES.SECRET_KEY,
    KEY_TYPES.GENERATE_KEY,
    KEY_TYPES.AUTO_SELECT_KEY,
  ])) as IStorageType;

  return data;
};

export const getExamDetails = async (baseUrl: string, attemptId: string) => {
  const { data } = await axios.get<IGetExamDetailsAPIResponseType>(
    INSTACKS_GET_EXAM_DETAILS_API.replace("<id>", attemptId).replace(
      "<base_url>",
      baseUrl
    ),
    { headers: { authentication: window.localStorage.getItem("auth_token") } }
  );

  return data.exam_models?.map((item) => ({
    name: item.model_name,
    questions: item.questions.map((x) => ({
      question: removePTag(x.question),
      questionImage: baseUrl + x.question_image,
      options: x.options.map((option, index) => ({
        option: removePTag(option.option),
        id: option.id,
        optionImage: baseUrl + x?.[`option_${index + 1}_image`],
        optionImagePartial: baseUrl + x?.[`option_${index + 1}_partial`],
      })),
      explanation: removePTag(x.explanation),
      explanationImage: baseUrl + x.explanation_image,
    })),
  }));
};

export const extractDataFromUrl = () => {
  const URL = window.location.href;

  const [BASE_URL, ATTEMPT_ID] = URL.split("/assessments/attempt/");

  return { BASE_URL, ATTEMPT_ID: ATTEMPT_ID.replace("/instructions", "") };
};

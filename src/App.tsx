import { Alert, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import FormProvider from "./components/hook-form/form-provider";
import { RHFAutocomplete } from "./components/hook-form/rhf-autocomplete";
import schema, { FormType } from "./schema";
import { LoadingButton } from "@mui/lab";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { KEY_TYPES } from "./constants";

const enum STATUS_TYPE {
  NOT_VERIFIED = "NOT_VERIFIED",
  PASSED = "PASSED",
  FAILED = "FAILED",
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(STATUS_TYPE.NOT_VERIFIED);

  const methods = useForm({
    defaultValues: { secretKey: "", generateKey: "E", autoSelectKey: "D" },
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
    mode: "all",
  });

  // const verifySecretKey = (form: FormType) =>
  //   axios
  //     .get("https://api.openai.com/v1/models", {
  //       headers: {
  //         Authorization: `Bearer ${form.secretKey}`,
  //       },
  //     })
  //     .then(() => {
  //       setStatus(STATUS_TYPE.PASSED);

  //       chrome.storage.local.set(
  //         {
  //           // [KEY_TYPES.SECRET_KEY]: form.secretKey,
  //           [KEY_TYPES.GENERATE_KEY]: form.generateKey,
  //           [KEY_TYPES.AUTO_SELECT_KEY]: form.autoSelectKey,
  //         },
  //         () => console.log("CONFIGURATION SET SUCCESSFULLY")
  //       );
  //     })
  //     .catch(() => {
  //       setStatus(STATUS_TYPE.FAILED);
  //       methods.reset();
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });

  const onSubmit = (form: FormType) => {
    setIsLoading(true);
    chrome.storage.local.set(
      {
        // [KEY_TYPES.SECRET_KEY]: form.secretKey,
        [KEY_TYPES.GENERATE_KEY]: form.generateKey,
        [KEY_TYPES.AUTO_SELECT_KEY]: form.autoSelectKey,
      },
      () => console.log("CONFIGURATION SET SUCCESSFULLY")
    );
    setIsLoading(false);
    setStatus(STATUS_TYPE.PASSED);
    // verifySecretKey(form);
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack p={3} gap={3}>
          <Typography variant="h6" mx="auto" fontWeight="800">
            AU CHEATER
          </Typography>

          <RHFAutocomplete
            size="small"
            name="generateKey"
            label="Generate Key"
            options={["E", "F", "T"]}
          />
          <RHFAutocomplete
            size="small"
            name="autoSelectKey"
            label="Auto Select Key"
            options={["D", "G", "Y"]}
          />

          {status !== STATUS_TYPE.NOT_VERIFIED ? (
            <Alert
              severity={status === STATUS_TYPE.PASSED ? "success" : "error"}
            >
              {status === STATUS_TYPE.PASSED
                ? "All set to go!!"
                : "Invalid OpenAI API Key"}
            </Alert>
          ) : null}

          <LoadingButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            loading={isLoading}
            disabled={
              !methods.formState.isValid || status === STATUS_TYPE.PASSED
            }
          >
            Submit
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}

export default App;

import { Alert, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import FormProvider from "./components/hook-form/form-provider";
import { RHFAutocomplete } from "./components/hook-form/rhf-autocomplete";
import schema, { FormType } from "./schema";
import { LoadingButton } from "@mui/lab";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  AUTO_SELECT_KEY_OPTIONS,
  GENERATE_KEY_OPTIONS,
  KEY_TYPES,
} from "./constants";

const enum STATUS_TYPE {
  NOT_VERIFIED = "NOT_VERIFIED",
  PASSED = "PASSED",
  FAILED = "FAILED",
}

function App() {
  const [status, setStatus] = useState(STATUS_TYPE.NOT_VERIFIED);

  const methods = useForm({
    defaultValues: { generateKey: "E", autoSelectKey: "D" },
    resolver: zodResolver(schema),
    reValidateMode: "onChange",
    mode: "all",
  });

  const onSubmit = (form: FormType) => {
    chrome.storage.local.set(
      {
        [KEY_TYPES.GENERATE_KEY]: form.generateKey,
        [KEY_TYPES.AUTO_SELECT_KEY]: form.autoSelectKey,
      },
      () => console.log("CONFIGURATION SET SUCCESSFULLY")
    );
    setStatus(STATUS_TYPE.PASSED);
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
            options={GENERATE_KEY_OPTIONS}
          />
          <RHFAutocomplete
            size="small"
            name="autoSelectKey"
            label="Auto Select Key"
            options={AUTO_SELECT_KEY_OPTIONS}
          />

          {status !== STATUS_TYPE.NOT_VERIFIED ? (
            <Alert
              severity={status === STATUS_TYPE.PASSED ? "success" : "error"}
            >
              {status === STATUS_TYPE.PASSED
                ? "All set to go!! Please reload the page"
                : "Invalid OpenAI API Key"}
            </Alert>
          ) : null}

          <LoadingButton
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
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

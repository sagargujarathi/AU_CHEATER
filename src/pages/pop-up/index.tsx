import { Alert, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import schema, { FormType } from "@/pages/pop-up/schema";
import {
  AUTO_SELECT_KEY_OPTIONS,
  GENERATE_KEY_OPTIONS,
  KEY_TYPES,
} from "@/constants";
import FormProvider from "@/components/hook-form/form-provider";
import { RHFAutocomplete } from "@/components/hook-form/rhf-autocomplete";
import { RHFCheckbox } from "@/components/hook-form/rhf-checkbox";
import TermsAndConditions from "../terms-and-conditions";

const enum STATUS_TYPE {
  NOT_VERIFIED = "NOT_VERIFIED",
  PASSED = "PASSED",
  FAILED = "FAILED",
}

function Popup() {
  const [status, setStatus] = useState(STATUS_TYPE.NOT_VERIFIED);
  const [isTACPage, setIsTACPage] = useState(false);

  const methods = useForm({
    defaultValues: {
      generateKey: "E",
      autoSelectKey: "D",
      termsAndConditions: false,
    },
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
        {isTACPage ? (
          <TermsAndConditions onClick={() => setIsTACPage((x) => !x)} />
        ) : (
          <Stack p={3} gap={3}>
            <Typography variant="h6" mx="auto" fontWeight="800">
              INSTACKS CHEATER
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

            <RHFCheckbox
              name="termsAndConditions"
              label={
                <>
                  I agree to the{" "}
                  <Button
                    variant="text"
                    onClick={() => setIsTACPage((x) => !x)}
                    disableElevation
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    sx={{ textDecoration: "underline" }}
                  >
                    Terms and Conditions
                  </Button>
                </>
              }
            />

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
        )}
      </FormProvider>
    </>
  );
}

export default Popup;

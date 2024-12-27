import { Stack, Typography } from "@mui/material";
import AlertIcon from "../../assets/icons/alert-icon";

interface IErrorComponentType {
  message?: string;
  state?: "active" | "error" | "success" | "disabled";
}

const ErrorComponent = ({ message }: IErrorComponentType) => {
  return (
    <Stack direction="row" gap={0.5} alignItems="center" flexWrap="wrap">
      <AlertIcon />
      <Typography variant="caption">{message}</Typography>
    </Stack>
  );
};

export default ErrorComponent;

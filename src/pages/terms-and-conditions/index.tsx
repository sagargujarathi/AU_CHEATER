import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Button, Stack } from "@mui/material";

interface ITACType {
  onClick: () => void;
}

const TermsAndConditions = ({ onClick }: ITACType) => {
  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 4 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Terms and Conditions
        </Typography>
        <Button onClick={onClick} size="small" variant="contained">
          Go Back
        </Button>
      </Stack>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <>
                <Typography variant="h5">1. Use at Your Own Risk:</Typography>
                <Typography variant="body1">
                  This extension is provided "as is" without any warranties,
                  express or implied. <br />
                  The use of this extension to circumvent exam security measures
                  may be illegal and may violate the terms of service of the
                  online exam platform. <br /> You are solely responsible for
                  any and all consequences arising from the use of this
                  extension, including but not limited to: <br /> Academic
                  penalties (e.g., grade deductions, course failure, suspension,
                  expulsion) <br /> Legal action <br /> Damage to your computer
                  or device <br /> Loss of data <br /> Reputational damage
                </Typography>
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <>
                <Typography variant="h5">2. Academic Integrity:</Typography>
                <Typography variant="body1">
                  This extension is not intended to be used for cheating or
                  academic dishonesty. <br /> Academic integrity is paramount.{" "}
                  <br />
                  Using this extension to cheat on exams is unethical and may
                  have severe consequences.
                </Typography>
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <>
                <Typography variant="h5">
                  3. Compliance with Laws and Regulations:
                </Typography>
                <Typography variant="body1">
                  You are responsible for ensuring that your use of this
                  extension complies with all applicable laws and regulations,
                  including copyright laws, data privacy laws, and any other
                  relevant laws.
                </Typography>
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <>
                <Typography variant="h5">
                  4. Disclaimer of Liability:
                </Typography>
                <Typography variant="body1">
                  The developers of this extension shall not be liable for any
                  damages or losses arising from the use of this extension,
                  including but not limited to direct, indirect, incidental,
                  special, or consequential damages.
                </Typography>
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <>
                <Typography variant="h5">5. No Endorsement:</Typography>
                <Typography variant="body1">
                  This extension is not endorsed by any educational institution
                  or online exam platform.
                </Typography>
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <>
                <Typography variant="h5">6. Right to Modify:</Typography>
                <Typography variant="body1">
                  The developers reserve the right to modify or discontinue this
                  extension at any time without notice.
                </Typography>
              </>
            }
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              <>
                <Typography variant="h5">7. Consent:</Typography>
                <Typography variant="body1">
                  By using this extension, you acknowledge that you have read
                  and understood these terms and conditions and agree to be
                  bound by them.
                </Typography>
              </>
            }
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default TermsAndConditions;

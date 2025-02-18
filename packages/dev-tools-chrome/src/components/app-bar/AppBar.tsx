import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import { useColorScheme } from '@mui/joy/styles';
import Tooltip from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <Tooltip title="Change theme" variant="outlined">
      <IconButton
        data-screenshot="toggle-mode"
        size="sm"
        variant="plain"
        color="neutral"
        sx={{ alignSelf: 'center', ml: 1 }}
        onClick={() => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
        }}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default function Header() {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', m: 1 }}>
      <Input
        size="sm"
        variant="outlined"
        placeholder="Search anything…"
        startDecorator={<SearchRoundedIcon color="primary" />}
        endDecorator={
          <Typography level="title-sm" textColor="text.icon">
            ⌘ K
          </Typography>
        }
        sx={{
          alignSelf: 'center',
          flexGrow: 1,
        }}
      />

      <ColorSchemeToggle />
    </Box >
  );
}
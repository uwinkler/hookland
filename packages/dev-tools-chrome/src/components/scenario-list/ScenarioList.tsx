/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageExtension, Scenario } from '@hookland/dev-tools-commons'
import {
  Box,
  List,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  useTheme
} from '@mui/joy'
import { useEffect } from 'react'
import { useScenariosState } from './useScenarios'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

function useMessageFromClient() {
  const [, setScenarios] = useScenariosState()

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Received message:!', request, sender, sendResponse)
      if (request.type === 'SCENARIOS') {
        setScenarios(request.payload.scenarios)
      }
    })
  })
}

export function ScenarioList() {
  const [scenarios] = useScenariosState()
  useMessageFromClient()

  return (
    <List size="sm">
      {scenarios.map((scenario) => (
        <ScenarioListItem key={scenario.id} scenario={scenario} />
      ))}
    </List>
  )
}

export function ScenarioListItem(props: { scenario: Scenario }) {
  const { scenario } = props
  const theme = useTheme()

  const handleClick = (id: string) => () => {
    
    const msg: MessageExtension<any, any> = {
      type: 'SET_ACTIVE_SCENARIO',
      source: "HOOKLAND_HUD_EXTENSION",
      payload: { id }
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const id = tabs[0].id
      if(id === undefined) {
        return
      }
      chrome.tabs.sendMessage(id, msg, function(response) {
        console.log("Response from content script:", response);
      });
    });
  }
  return (
    <ListItemButton onClick={handleClick(scenario.id)}>
      <ListItemDecorator>
        {scenario.active ? (
          <CheckCircleIcon sx={{ color: theme.palette.success[400] }} />
        ) : (
          <RadioButtonUncheckedIcon />
        )}
      </ListItemDecorator>
      <ListItemContent>
        <Box sx={{ fontWeight: 'bold' }}>
          {scenario.id} {scenario.name}
        </Box>
        <Box
          sx={{
            fontSize: '0.8rem',
            color: theme.palette.neutral[400],
            textOverflow: 'ellipsis',
            whiteSpace: 'no-wrap'
          }}
        >
          {scenario.description}
        </Box>
      </ListItemContent>
    </ListItemButton>
  )
}

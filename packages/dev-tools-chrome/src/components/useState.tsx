import { State } from '../model/state.model'

export const defaultState: State = {
  uiConfigs: [
    {
      id: 'default',
      name: 'General',
      tab: 'General',
      group: 'User',
      descriptionLong: `
        # General settings
       
        This is the place where you can configure user settings.
      `,
      descriptionShort: 'General settings',
      url: 'https://hook.land',
      blocksGroup: [
        {
          id: 'current-user',
          type: 'markdown',
          content: `
          Current user: nn@lexoffice.de

          Privileges: \`ADMIN\`, \`LEXBANK_TEASER\`
          `
        },
        {
          id: 'user-select',
          type: 'select',
          label: 'User',
          value: 'nn@lexoffice.de',
          options: [
            { value: 'nn@lexoffice.de', label: 'nn@lexoffice.de' },
            { value: 'otherUser@lexoffice.de', label: 'Other User' }
          ]
        }
      ]
    },

    {
      id: 'VoucherWidget',
      name: 'VoucherWidget',
      tab: 'VoucherWidget',
      group: 'User',
      url: 'https://hook.land',
      descriptionLong: `
        # General settings
       
        This is the place where you can configure user settings.
      `,
      blocksGroup: []
    }
  ]
}

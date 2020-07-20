// UPDATE NOTE
export const updateNote = (note) => ({
    type: 'UPDATE_NOTE',
    note
  })

  export const updateUserAddSnippet = (snippet) => ({
    type: 'UPDATE_USER_ADD_SNIPPET',
    snippet
  })

  export const updateTeamAddSnippets = (team, snippet) => ({
    type: 'UPDATE_TEAM_ADD_SNIPPETS',
    team,
    snippet
  })
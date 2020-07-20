export const userSnippets =  [
    {
        id: 'id1',
        shortcut: '.snipOne',
        text: '<div>SnipOne text.</div>'
    },
    {
        id: 'id2',
        shortcut: '.snipTwo',
        text: '<div>SnipTwo text.</div>'
    }
]

export const teamSnippets = {
    team: [
        ...userSnippets
    ],
    team2: [
        ...userSnippets
    ]    
}

export const userAddSnippet = {
    shortcut: '.user',
    text: 'This is a temp user input text'
}

export const teamAddSnippets = {
    team: {
        shortcut: '.team',
        text: 'This is a temp team input text'
    }
}
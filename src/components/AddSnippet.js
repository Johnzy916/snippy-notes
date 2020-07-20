import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import DOMPurify from 'dompurify'
import { useAlert } from 'react-alert'
import isEmpty from 'validator/lib/isEmpty'
import { startAddUserSnippet } from '../actions/user'
import { startAddTeamSnippet } from '../actions/teams'
import { updateUserAddSnippet, updateTeamAddSnippets } from '../actions/temp'
import { copyText, pasteText } from '../utils/clipboard'

export const AddSnippet = ({ addUserSnippet, addTeamSnippet, type, team,
                            userSnippets, teamSnippets, userAddSnippet,
                            teamAddSnippets, updateUserSnippet, updateTeamSnippets }) => {

  // refs
  const shortcutRef = useRef()
  const textRef = useRef()

  // initiate react-alert
  const alert = useAlert();

  // save and insert on mount or unmount
  useEffect(() => {
      if (team && teamAddSnippets && teamAddSnippets[team]) {
        textRef.current.innerHTML = DOMPurify.sanitize(teamAddSnippets[team].text)
      } else if (!team && userAddSnippet) {
        textRef.current.innerHTML = DOMPurify.sanitize(userAddSnippet.text)
      }

      return () => {
          const snippet = { 
            shortcut: shortcutRef.current.textContent,
            text: DOMPurify.sanitize(textRef.current.innerHTML)
          }
          if (team) {
            updateTeamSnippets(team, snippet)
          } else {
            updateUserSnippet(snippet)
          }
      }
  }, [])

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    const shortcut = e.target.children[0]
    const text = e.target.children[1]
    if (isEmpty(shortcut.textContent) || isEmpty(text.innerHTML)) {
      alert.show('Please fill out both inputs!')
    // check if shortcut already exists in personal snippets
    } else if (userSnippets.some(el => el.shortcut === shortcut.textContent)) {
      alert.show('This key is already used in your snippets!')
    // check if shortcut already exists in other team snippets
    } else if ([].concat(...Object.values(teamSnippets)
                  .map(arr => arr.map(obj => obj.shortcut)))
                  .includes(shortcut.textContent)) {
     alert.show('This key is already used in your team snippets!')
    } else {
      // only admins can add snippets, otherwise it's the user's page
      (team && type === 'admin') ?
        addTeamSnippet(team, { 
          shortcut: shortcut.textContent,
          text: DOMPurify.sanitize(text.innerHTML)
        })
      : addUserSnippet({ 
          shortcut: shortcut.textContent, 
          text: DOMPurify.sanitize(text.innerHTML)
        })
      shortcut.textContent = '';
      text.textContent = '';
      shortcut.focus()
    }
  }

  return (
    <form className="add-snippet"
      id="add-snippet-form"
      onSubmit={handleSubmit} >
      <div className="add-snippet__input add-snippet__shortcut"
        data-placeholder="Key"
        ref={shortcutRef}
        data-team={team}
        contentEditable
        suppressContentEditableWarning
        onCopy={(e) => {
          e.preventDefault()
          copyText(e)
        }}
        onPaste={(e) => {
          e.preventDefault()
          pasteText(e)
        }}>
          {
            (team && teamAddSnippets && teamAddSnippets[team]) ?
              teamAddSnippets[team].shortcut
            : (!team && userAddSnippet) ?
              userAddSnippet.shortcut
            : ''
          }
      </div>
      <div className="add-snippet__input add-snippet__text"
        data-placeholder="Snippet"
        ref={textRef}
        data-team={team}
        contentEditable
        onCopy={(e) => {
          e.preventDefault()
          copyText(e)
        }}
        onPaste={(e) => {
          e.preventDefault()
          pasteText(e)
        }}>

      </div>
      <button className="btn btn--secondary btn--shine btn--add"
        type="submit" >
        &#x2b;
      </button>
    </form>
  );
}

const mapStateToProps = (state) => ({
  userSnippets: state.user.snippets || [],
  teamSnippets: state.teams.snippets || [],
  userAddSnippet: state.temp.user,
  teamAddSnippets: state.temp.teams
});

const mapDispatchToProps = (dispatch) => ({
  addUserSnippet: (snippetData) => dispatch(startAddUserSnippet(snippetData)),
  addTeamSnippet: (team, snippetData) => dispatch(startAddTeamSnippet(team, snippetData)),
  updateUserSnippet: (snippet) => dispatch(updateUserAddSnippet(snippet)),
  updateTeamSnippets: (team, snippet) => dispatch(updateTeamAddSnippets(team, snippet))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddSnippet)
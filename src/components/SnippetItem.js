import React from 'react'
import { connect } from 'react-redux'
import DOMPurify from 'dompurify'
import { startRemoveUserSnippet, startEditUserSnippet } from '../actions/user'
import { startRemoveTeamSnippet, startEditTeamSnippet } from '../actions/teams'
import { copyText, pasteText } from '../utils/clipboard'

export const SnippetItem = ({ id, shortcut, text, team, isAdmin, isUser,
                            removeUserSnippet, editUserSnippet,
                            removeTeamSnippet, editTeamSnippet,
                            isSuperAdmin, isProjectAdmin }) => {
    
    return (
        <div className="list-item">
            <div className={`li__shortcut`} 
                data-shortcut={`${id}`} 
                contentEditable={isUser || isAdmin || isProjectAdmin || isSuperAdmin}
                suppressContentEditableWarning
                onBlur={(e) => {
                    isUser ?
                    editUserSnippet(id, { shortcut: e.target.textContent })
                    : editTeamSnippet(team, id, { shortcut: e.target.textContent })
                }}
                onCopy={(e) => {
                    e.preventDefault()
                    copyText(e)
                }}
                onPaste={(e) => {
                    e.preventDefault()
                    pasteText(e)
                }}>
                    { shortcut }
            </div>
            <div className={`li__text-wrapper`}>
                <div className={`li__text`} 
                    data-text={`${id}`} 
                    contentEditable={isUser || isAdmin || isProjectAdmin || isSuperAdmin}
                    onBlur={(e) => {
                        isUser ?
                        editUserSnippet(id, { text: DOMPurify.sanitize(e.target.innerHTML) })
                        : editTeamSnippet(team, id, { text: DOMPurify.sanitize(e.target.innerHTML) })
                    }}
                    onCopy={(e) => {
                        e.preventDefault()
                        copyText(e)
                    }}
                    onPaste={(e) => {
                        e.preventDefault()
                        pasteText(e)
                    }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}>
                </div>
            </div>
            {
                // only show delete button if user type
                (isUser || (isAdmin || isSuperAdmin || isProjectAdmin)) &&
                <div className="li__buttons">
                    <button 
                        className="btn btn--gray btn--link btn--remove"
                        onClick={() => {
                            isUser ?
                            removeUserSnippet(id)
                            : removeTeamSnippet(team, id)
                        }}>
                    &#x2715;
                    </button>
                </div>
            }
        </div>
    );
};

const mapStateToProps = (state) => ({
    userSnippets: state.user.snippets,
    teamSnippets: state.teams.snippets,
    isSuperAdmin: state.admin.role === 'superAdmin',
    isProjectAdmin: state.admin.role === 'projectAdmin'
})

const mapDispatchToProps = (dispatch) => ({
    removeUserSnippet: (id) => dispatch(startRemoveUserSnippet(id)),
    editUserSnippet: (id, edits) => dispatch(startEditUserSnippet(id, edits)),
    editTeamSnippet: (team, id, edits) => dispatch(startEditTeamSnippet(team, id, edits)),
    removeTeamSnippet: (team, id) => dispatch(startRemoveTeamSnippet(team, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(SnippetItem);
import React  from 'react';
import { connect } from 'react-redux';
import SnippetItem from './SnippetItem';

export const SnippetList = ({ snippets, teamSnippets, team,
                            isAdmin, isTeamAdmin }) => {
    return (
        <div className="snippet-list">
        {
            (team) && (
                (teamSnippets[team] && teamSnippets[team].length > 0) ? (
                    teamSnippets[team].map(snippet => (
                        <SnippetItem 
                            key={snippet.id} 
                            team={team} 
                            isAdmin={isAdmin} 
                            {...snippet} />
                    ))
                ) : (
                    <div className="team-container__message">
                    {
                      isTeamAdmin.includes(team) ?
                        (<span>This team doesn't have any snippets.<br />
                        Create the first one!</span>)
                      : (<span>This team doesn't have any snippets.<br />
                        Please work with your team admin to create some!</span>)
                    }
                    </div> 
                )
            )
        } 
        { 
            (!team) && (
                snippets.length > 0 ? (
                    snippets.map(snippet => (
                        <SnippetItem 
                            key={snippet.id} 
                            isUser={true} 
                            {...snippet} />
                    ))
                ) : (
                    <div className="list-item__message">
                        You don't have any snippets. Add some!
                    </div>
                )
            )
        }
        </div>
    )
}

const mapStateToProps = (state) => ({
    snippets: state.user.snippets || [],
    teamSnippets: state.teams.snippets || {},
    isTeamAdmin: state.admin.isTeamAdmin || [],
})

export default connect(mapStateToProps)(SnippetList);
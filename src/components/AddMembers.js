import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import isEmail from 'validator/lib/isEmail';
import { useAlert } from 'react-alert';
import { expandSection, collapseSection } from '../utils/expandSection';
import { startAddTeamMember, startRemoveTeamMember, setCurrentTeam, startRemoveTeamAdmin } from '../actions/admin';

export const AddMembers = ({ isTeamAdmin, currentTeam, addMember, setTeam, isDataLoaded,
                              teamMembers, removeMember, teamAdmins, isProjectAdmin,
                              userEmail, isSuperAdmin, removeAdmin }) => {

    // refs
    const areaRef = useRef()
    const chevronRef = useRef()

    // initiate react-alert
    const alert = useAlert()

    // collapse expandable area
    useEffect(() => {
      collapseSection(areaRef.current)
    }, [])

    // handle form submit
    const handleSubmit = (e) => {
      e.preventDefault();
      const memberEmail = e.target.children[1]
      if (!isEmail(memberEmail.value)) {
        alert.show('Please enter a valid email!', { type: 'error' })
      } else if (teamMembers[currentTeam].includes(memberEmail.value)) {
        alert.show('User is already a member of the team!')
      } else if (isSuperAdmin || isProjectAdmin || isTeamAdmin.includes(currentTeam)) {
        addMember(currentTeam, memberEmail.value);
        memberEmail.value = '';
      } else {
        alert.show('You must be an admin to add team members!')
      }
    }

    // handle item remove
    const handleRemove = (e) => {
      const member = e.target.previousElementSibling.textContent
      if (isProjectAdmin || isSuperAdmin ||
        !e.target.closest('div').classList.contains('admin-area__item--admin') ||
        member === userEmail) {
          const userIsAdmin = teamAdmins[currentTeam].includes(member)
          // if there's only one admin left, don't remove them
          if (userIsAdmin && Object.keys(teamAdmins[currentTeam]).length === 1) {
            alert.show(`There should be at least one team admin!`)
          //  else if member is an admin, remove the admin and member
          } else if (userIsAdmin) {
            removeAdmin(currentTeam, member) // removes both
            // else, just remove the member
          } else {
            removeMember(currentTeam, member)
          }
      } else {
        alert.show(`You can't remove another admin!`)
      }
    }

    // handle section expansion
    const handleExpansion = () => {
      const area = areaRef.current
      const chevron = chevronRef.current
      const isCollapsed = area.getAttribute('data-collapsed') === 'true';
        
      if(isCollapsed) {
        expandSection(area)
        area.setAttribute('data-collapsed', 'false')
        chevron.style.transform = 'rotate(180deg)';
      } else {
        collapseSection(area)
        chevron.style.transform = 'rotate(0deg)';
      }
    }


  return (
    <div className="admin-module">
      <div className="admin-section__header">
        Add Team Members
      </div>
      <div className="admin-section">
      <div className="add-member">
          <form className="add-member__input-form"
            id="add-member-form"
            onSubmit={handleSubmit}>
            {
              (teamMembers && currentTeam) && (
                Object.keys(teamMembers).length < 2 ? (
                  <div className="add-member__team-name">
                    { 
                      Object.keys(teamMembers)[0].charAt(0).toUpperCase() + Object.keys(teamMembers)[0].slice(1)
                    }
                  </div>
                  ) : (
                  <Dropdown 
                    options={Object.keys(teamMembers)
                              .map(team => team.charAt(0).toUpperCase() + team.slice(1))}
                    value={currentTeam.charAt(0).toUpperCase() + currentTeam.slice(1)}
                    onChange={(e) => setTeam(e.value.toLowerCase())} />
                )
              )
            }
            <input className="add-member__input add-member__email"
                placeholder="Google account email"
                contentEditable >
            </input>
            <button className="btn btn--secondary btn--shine btn--add"
              type="submit">
              &#x2b;
            </button>
          </form>
        </div>
      </div>
      <div className="admin-expandable-area-container expandable-member-area"
        ref={areaRef}>
        <div className="admin-expandable-area__notification--white">
            <div className="admin__key-square"></div> = Team admin
        </div>
        <div className="admin-expandable-area">
                {
                  isDataLoaded && (
                    teamMembers[currentTeam].sort((a, b) => a < b ? -1 : 1).map(member => {
                      return (
                        // add dom class for admins to highlight in ui
                        <div className={ teamAdmins[currentTeam].includes(member) ?
                                        "admin-area__item--admin"
                                      : "admin-area__item"} key={member}>
                            <div className="admin-area__item-text">
                              { member }
                            </div>
                            <button className="admin-area__item-remove"
                            onClick={handleRemove}>
                              &#x2715;
                            </button>
                        </div>
                      );
                    })
                  )
                }
        </div>
      </div>
      <div className="admin-section__footer"
        onClick={handleExpansion}>
        View members
        <div className="chevron-logo-container member-chevron">
          <svg ref={chevronRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isTeamAdmin: state.admin.isTeamAdmin,
  currentTeam: state.admin.currentTeam,
  teamMembers: state.admin.teamMembers || {},
  teamAdmins: state.admin.teamAdmins,
  userEmail: state.user.email,
  isProjectAdmin: state.admin.role === 'projectAdmin',
  isSuperAdmin: state.admin.role === 'superAdmin',
  isDataLoaded: state.admin.currentTeam && state.admin.teamMembers && 
                state.admin.teamAdmins
})

const mapDispatchToProps = (dispatch) => ({
  addMember: (team, email) => dispatch(startAddTeamMember(team, email)),
  setTeam: (team) => dispatch(setCurrentTeam(team)),
  removeMember: (team, email) => dispatch(startRemoveTeamMember(team, email)),
  removeAdmin: (team, email) => dispatch(startRemoveTeamAdmin(team, email))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers);
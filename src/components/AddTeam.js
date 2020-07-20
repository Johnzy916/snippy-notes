import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import { useAlert } from 'react-alert';
import { startAddTeam, startRemoveTeam } from '../actions/admin';
import { expandSection, collapseSection } from '../utils/expandSection';

export const AddTeam = ({ addTeam, allTeams, removeTeam, isSuperAdmin,
                          isProjectAdmin, currentProject }) => {

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
    const nameInput = e.target.children[0];
    const adminInput = e.target.children[1];
    if (!nameInput.value || !adminInput.value) {
      alert.show('Both inputs are required!')
    } else if (!isEmail(adminInput.value)) {
      alert.show('Please enter a valid email!', { type: 'error' })
    } else if (isSuperAdmin || isProjectAdmin) {
      addTeam(currentProject, nameInput.value, adminInput.value);
      nameInput.value = '';
      adminInput.value = '';
      nameInput.focus();
      // if team already exists,
      // show message that new admin was added
      if (allTeams.includes(nameInput.value)) {
        alert.show('Team already exists. New admin added!')
      }
    } else {
      alert.show('You must be an admin to add teams!')
    }
  }

  // handle item remove
  const handleRemove = (e) => {
    const team = e.target.previousElementSibling.textContent
    if (isSuperAdmin || isProjectAdmin) {
      removeTeam(currentProject, team)
    } else {
      alert.show('You must be an admin to remove teams!')
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
        Add New Team
      </div>
      <div className="admin-section">
        <div className="add-team">
            <form className="add-team__input-form"
              id="add-team-form"
              onSubmit={handleSubmit}>
              <input className="add-team__input add-team__name"
                  placeholder="Team name"
                  contentEditable >
              </input>
              <input className="add-team__input add-team__admin"
                  placeholder="Team admin (Google email)"
                  contentEditable>
              </input>
              <button className="btn btn--secondary btn--shine btn--add"
                type="submit"
                form="add-team-form">
                &#x2b;
              </button>
            </form>
        </div>
      </div>
      <div className="admin-expandable-area-container expandable-team-area"
        ref={areaRef}>
        <div className="admin-expandable-area__notification">
            Deleting a team will remove their snippets!
        </div>
        <div className="admin-expandable-area">
        {
          allTeams && (
            allTeams.length > 0 ? (
              allTeams.sort((a, b) => a > b ? 1 : -1).map(team => {
                return (
                  <div className="admin-area__item" key={team}>
                      <div className="admin-area__item-text">
                        { team.charAt(0).toUpperCase() + team.slice(1) }
                      </div>
                      <button className="admin-area__item-remove"
                      onClick={handleRemove}>
                        &#x2715;
                      </button>
                  </div>
                )
              })
            ) : (
              <div className="list-item__message">
                  There are no teams for {currentProject ? currentProject.charAt(0).toUpperCase() + currentProject.slice(1) : `this project`}. Add the first one!
              </div>
            )
          )
        }
        </div>
      </div>
      <div className="admin-section__footer"
        onClick={handleExpansion}>
        View teams 
        <div className="chevron-logo-container team-chevron">
          <svg ref={chevronRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  allTeams: state.admin.allTeams || [],
  isSuperAdmin: state.admin.role === 'superAdmin',
  isProjectAdmin: state.admin.role === 'projectAdmin',
  currentProject: state.admin.currentProject,
})

const mapDispatchToProps = (dispatch) => ({
  addTeam: (project, name, admin) => dispatch(startAddTeam(project, name, admin)),
  removeTeam: (project, team) => dispatch(startRemoveTeam(project, team))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddTeam);
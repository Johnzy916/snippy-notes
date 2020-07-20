import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import isEmail from 'validator/lib/isEmail'
import { useAlert } from 'react-alert'
import Dropdown from 'react-dropdown'
import { expandSection, collapseSection } from '../utils/expandSection'
import { startAddProjectAdmin, startRemoveProjectAdmin, setCurrentProject } from '../actions/admin'

export const AddAdmins = ({ addAdmin, removeAdmin, projectAdmins, isProjectAdmin,
                          isSuperAdmin, currentProject, setProject, allProjects }) => {
    
    // refs
    const areaRef = useRef()
    const chevronRef = useRef()

    // initiate react-alert
    const alert = useAlert()

    // collapse expandable area on load
    useEffect(() => {
      collapseSection(areaRef.current)
    }, [])

    // handle form submit
    const handleSubmit = (e) => {
      e.preventDefault();
      const adminEmail = e.target.children[1]

      if (!isEmail(adminEmail.value)) {
        alert.show('Please enter a valid email!', { type: 'error' })
      } else if (isSuperAdmin || isProjectAdmin) {
        if (projectAdmins[currentProject].includes(adminEmail.value)) {
          alert.show('This user is already a project admin!')
        } else {
          addAdmin(currentProject, adminEmail.value);
          adminEmail.value = '';
        }
      } else {
        alert.show('Only admins can add project admins!')
      }
    }

    // handle item remove
    const handleRemove = (e) => {
      const email = e.target.previousElementSibling.textContent

      if (isSuperAdmin || isProjectAdmin) {
        if (projectAdmins[currentProject].length === 1) {
          alert.show('There must be at least one project admin!')
        } else {
          removeAdmin(currentProject, email)
        }
      } else {
        alert.show('You must be an admin to do this!')
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
        Add Project Admin
      </div>
      <div className="admin-section">
      <div className="add-admin">
          <form className="add-admin__input-form"
            id="add-admin-form"
            onSubmit={handleSubmit}>
            {
              (allProjects && currentProject) && (
                allProjects.length < 2 ? (
                  <div className="add-admin__project-name">
                    { 
                      currentProject.charAt(0).toUpperCase() + currentProject.slice(1)
                    }
                  </div>
                ) : (
                  <Dropdown 
                    options={allProjects.map(project => project.charAt(0).toUpperCase() + project.slice(1))}
                    value={currentProject.charAt(0).toUpperCase() + currentProject.slice(1)}
                    onChange={(e) => setProject(e.value.toLowerCase())} />
                )
              )
            }
            <input className="add-admin__input add-admin__email"
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
      <div className="admin-expandable-area-container expandable-app-admin-area"
        ref={areaRef}>
        <div className="admin-expandable-area">
            {
              (projectAdmins && currentProject) && (
                projectAdmins[currentProject].sort((a, b) => a < b ? -1 : 1).map(email => {
                  return (
                    <div className="admin-area__item" key={email}>
                        <div className="admin-area__item-text">
                          { email }
                        </div>
                        <button className="admin-area__item-remove"
                        onClick={handleRemove}>
                          &#x2715;
                        </button>
                    </div>
                  )
                })
              )
            }
        </div>
      </div>
      <div className="admin-section__footer"
        onClick={handleExpansion}>
        View admins
        <div className="chevron-logo-container admin-chevron">
          <svg ref={chevronRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  projectAdmins: state.admin.admins,
  isSuperAdmin: state.admin.role === 'superAdmin',
  isProjectAdmin: state.admin.role === 'projectAdmin',
  currentProject: state.admin.currentProject,
  allProjects: state.admin.allProjects || []
})

const mapDispatchToProps = (dispatch) => ({
  addAdmin: (project, email) => dispatch(startAddProjectAdmin(project, email)),
  removeAdmin: (project, email) => dispatch(startRemoveProjectAdmin(project, email)),
  setProject: (project) => dispatch(setCurrentProject(project)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddAdmins);
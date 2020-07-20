import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import { useAlert } from 'react-alert';
import { startAddProject, startRemoveProject } from '../actions/admin';
import { expandSection, collapseSection } from '../utils/expandSection';

export const AddProject = ({ addProject, allProjects, removeProject,
                            isSuperAdmin }) => {

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
    const nameInput = e.target.children[0]
    const adminInput = e.target.children[1]
    if (!nameInput.value || !adminInput.value) {
      alert.show('Both inputs are required!')
    } else if (!isEmail(adminInput.value)) {
      alert.show('Please enter a valid email!', { type: 'error' })
    } else if (isSuperAdmin) {
      addProject(nameInput.value, adminInput.value);
      nameInput.value = '';
      adminInput.value = '';
      nameInput.focus();
      // if project already exists,
      // show message that new admin was added
      if (allProjects.includes(nameInput.value)) {
        alert.show('Project already exists. New admin added!')
      }
    } else {
      alert.show('You must be a super admin to do this!')
    }
  }

  // handle remove item
  const handleRemove = (e) => {
    const project = e.target.previousElementSibling.textContent
    if (isSuperAdmin) {
    removeProject(project)
    } else {
      alert.show('You must be a super admin to do this!')
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
        Add New Project
      </div>
      <div className="admin-section">
        <div className="add-team">
            <form className="add-team__input-form"
              id="add-project-form"
              onSubmit={handleSubmit}>
              <input className="add-team__input add-project__name"
                  placeholder="Project name"
                  contentEditable >
              </input>
              <input className="add-team__input add-project__admin"
                  placeholder="Project admin (Google email)"
                  contentEditable>
              </input>
              <button className="btn btn--secondary btn--shine btn--add"
                type="submit"
                form="add-project-form">
                &#x2b;
              </button>
            </form>
        </div>
      </div>
      <div className="admin-expandable-area-container expandable-project-area"
        ref={areaRef}>
        <div className="admin-expandable-area__notification">
            Deleting a project will remove ALL of it's teams and data!
        </div>
        <div className="admin-expandable-area">
        {
          allProjects && (
            allProjects.length > 0 ? (
              allProjects.sort((a, b) => a > b ? 1 : -1).map(project => {
                return (
                  <div className="admin-area__item" key={project}>
                      <div className="admin-area__item-text">
                        { project.charAt(0).toUpperCase() + project.slice(1) }
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
                  There are no projects. Add the first one!
              </div>
            )
          )
        }
        </div>
      </div>
      <div className="admin-section__footer"
        onClick={handleExpansion}>
        View projects 
        <div className="chevron-logo-container project-chevron">
          <svg ref={chevronRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  allProjects: state.admin.allProjects,
  isSuperAdmin: state.admin.role === 'superAdmin',
})

const mapDispatchToProps = (dispatch) => ({
  addProject: (name, admin) => dispatch(startAddProject(name, admin)),
  removeProject: (project) => dispatch(startRemoveProject(project))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddProject);
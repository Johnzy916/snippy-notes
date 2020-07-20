import React from 'react'
import { shallow } from 'enzyme'
import { AddProject } from '../../components/AddProject'
import data from '../fixtures/adminData'

const state = {
    ...data,
    isSuperAdmin: true
}

let wrapper, addProject, removeProject

beforeEach(() => {
    addProject = jest.fn()
    removeProject = jest.fn()
    wrapper = shallow(<AddProject {...state}
                    addProject={addProject}
                    removeProject={removeProject}
                    />)
})

it('should render AddProject correctly when there are projects', () => {
    expect(wrapper).toMatchSnapshot()
})

it('should render AddProject correctly when there are no projects', () => {
    const props = { ...state, allProjects: [] }
    wrapper = shallow(<AddProject { ...props } />)
    expect(wrapper).toMatchSnapshot()
});

it('should call addProject with valid input', () => {
    const project = 'project'
    const email = 'admin@email.com'
    const target = { children: [
         { value: project, focus() {} }, { value: email } 
        ]}
    wrapper.find('#add-project-form').simulate('submit', {
        preventDefault: () => {},
        target
    })
    expect(addProject).toHaveBeenLastCalledWith(project, email)
});

it('should call removeProject when project is removed', () => {
    const project = state.allProjects[0]
    wrapper.find(`.admin-area__item-remove`).at(0).simulate('click', {
        target: { previousElementSibling: { textContent: project }}
    })
    expect(removeProject).toHaveBeenLastCalledWith(project)
})
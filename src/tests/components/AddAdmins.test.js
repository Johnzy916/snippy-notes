import React from 'react'
import { shallow } from 'enzyme'
import { AddAdmins } from '../../components/AddAdmins'
import data from '../fixtures/adminData'

const state = {
    ...data,
    isSuperAdmin: true
}

let wrapper, setProject, addAdmin, removeAdmin

beforeEach(() => {
    setProject = jest.fn()
    addAdmin = jest.fn()
    removeAdmin = jest.fn()
    wrapper = shallow(<AddAdmins {...state}
                    setProject={setProject}
                    addAdmin={addAdmin}
                    removeAdmin={removeAdmin}
                    />)
})

it('should render AddAdmins with no dropdown', () => {
    const props = {
        ...state,
        allProjects: [state.allProjects[0]]
    }
    wrapper = shallow(<AddAdmins {...props} />)
    expect(wrapper).toMatchSnapshot()
})

it('should render AddAdmins with dropdown', () => {
    expect(wrapper).toMatchSnapshot()
})

it('should render project admin emails', () => {
    expect(wrapper.find('.admin-area__item')).toHaveLength(2)
})

it('should call setCurrentProject on dropdown change', () => {
    const value = state.allProjects[1]
    wrapper.find('Dropdown').prop('onChange')({ value })
    expect(setProject).toHaveBeenLastCalledWith(value)
})

it('should call addAdmin on valid input', () => {
    const value = 'test@email.com'
    const target = { children: [ '', { value } ]}
    wrapper.find('#add-admin-form').simulate('submit', {
        preventDefault: () => {},
        target
    })
    expect(addAdmin).toHaveBeenLastCalledWith(state.currentProject, value)
})

it('should call removeAdmin when remove button clicked', () => {
    const email = state.projectAdmins[state.currentProject][0]
    wrapper.find(`.admin-area__item-remove`).at(0).simulate('click', {
        target: { previousElementSibling: { textContent: email }}
    })
    expect(removeAdmin).toHaveBeenLastCalledWith(state.currentProject, email)
})
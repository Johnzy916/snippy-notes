import React from 'react'
import { shallow } from 'enzyme'
import { AddMembers } from '../../components/AddMembers'
import data from '../fixtures/adminData'

const state = {
    ...data,
    isDataLoaded: true,
    isSuperAdmin: true
}

let wrapper, addMember, setTeam, removeMember, removeAdmin

beforeEach(() => {
    addMember = jest.fn()
    setTeam = jest.fn()
    removeMember = jest.fn()
    removeAdmin = jest.fn()
    wrapper = shallow(<AddMembers {...state}
                    addMember={addMember}
                    setTeam={setTeam}
                    removeMember={removeMember}
                    removeAdmin={removeAdmin}
                    />)
})

it('should render AddMembers with no dropdown', () => {
    const props = {
        ...state,
        teamMembers: { team: state.teamMembers.team }
    }
    wrapper = shallow(<AddMembers {...props} />)
    expect(wrapper).toMatchSnapshot()
})

it('should render AddMembers with dropdown', () => {
    expect(wrapper).toMatchSnapshot()
})

it('should render team member emails with correct class', () => {
    expect(wrapper.find('.admin-area__item--admin')).toHaveLength(1)
    expect(wrapper.find('.admin-area__item')).toHaveLength(1)
})

it('should call setTeam on Dropdown change', () => {
    const value = state.allTeams[1]
    wrapper.find('Dropdown').prop('onChange')({ value })
    expect(setTeam).toHaveBeenLastCalledWith(value)
})

it('should call addMember on valid input (as super/project admin)', () => {
    const value = 'test@email.com'
    const target = { children: [ '', { value } ]}
    wrapper.find('#add-member-form').simulate('submit', {
        preventDefault: () => {},
        target
    })
    expect(addMember).toHaveBeenLastCalledWith(state.currentTeam, value)
})

it('should call addMember on valid input (as teamAdmin)', () => {
    const value = 'test@email.com'
    const target = { children: [ '', { value } ]}
    const props = {
        ...state, isSuperAdmin: false
    }
    wrapper = shallow(<AddMembers {...props} addMember={addMember} />)
    wrapper.find('#add-member-form').simulate('submit', {
        preventDefault: () => {},
        target
    })
    expect(addMember).toHaveBeenLastCalledWith(state.currentTeam, value)
})

it('should call removeAdmin when admin is removed', () => {
    const email = state.teamMembers[state.currentTeam][0]
    wrapper.find(`.admin-area__item-remove`).at(0).simulate('click', {
        target: { previousElementSibling: { textContent: email }}
    })
    expect(removeAdmin).toHaveBeenLastCalledWith(state.currentTeam, email)
})

it('should call removeMember when member is removed', () => {
    const email = state.teamMembers[state.currentTeam][1]
    wrapper.find(`.admin-area__item-remove`).at(1).simulate('click', {
        target: { previousElementSibling: { textContent: email }}
    })
    expect(removeMember).toHaveBeenLastCalledWith(state.currentTeam, email)
})
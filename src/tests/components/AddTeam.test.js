import React from 'react'
import { shallow } from 'enzyme'
import { AddTeam } from '../../components/AddTeam'
import data from '../fixtures/adminData'

const state = {
    ...data,
    isSuperAdmin: true
}

let wrapper, addTeam, removeTeam

beforeEach(() => {
    addTeam = jest.fn()
    removeTeam = jest.fn()
    wrapper = shallow(<AddTeam {...state}
                    addTeam={addTeam}
                    removeTeam={removeTeam}
                    />)
})

it('should render AddTeam correctly when there are teams', () => {
    expect(wrapper).toMatchSnapshot()
})

it('should render AddTeam correctly when there are no teams', () => {
    const props = { ...state, allTeams: [] }
    wrapper = shallow(<AddTeam { ...props } />)
    expect(wrapper).toMatchSnapshot()
});

it('should call addTeam with valid input', () => {
    const team = 'team'
    const email = 'admin@email.com'
    const target = { children: [
         { value: team, focus() {} }, { value: email } 
        ]}
    wrapper.find('#add-team-form').simulate('submit', {
        preventDefault: () => {},
        target
    })
    expect(addTeam).toHaveBeenLastCalledWith(state.currentProject, team, email)
});

it('should call removeTeam when project is removed', () => {
    const team = state.allTeams[0]
    wrapper.find(`.admin-area__item-remove`).at(0).simulate('click', {
        target: { previousElementSibling: { textContent: team }}
    })
    expect(removeTeam).toHaveBeenLastCalledWith(state.currentProject, team)
})
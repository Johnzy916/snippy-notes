import React from 'react'
import { shallow, mount } from 'enzyme'
import { AddSnippet } from '../../components/AddSnippet'
import { userSnippets, teamSnippets, userAddSnippet, teamAddSnippets } from '../fixtures/snippets'

const userState = {
    userSnippets,
    teamSnippets,
}

const teamState = {
    teamSnippets,
    userSnippets,
    type: 'admin',
    team: 'team'
}

let wrapper, addUserSnippet, addTeamSnippet,
    updateUserSnippet, updateTeamSnippets

describe('user snippets page', () => {
    beforeEach(() => {
        addUserSnippet = jest.fn()
        updateUserSnippet = jest.fn()
        wrapper = shallow(<AddSnippet {...userState} 
                        addUserSnippet={addUserSnippet}
                        />)
    })

    it('should render AddSnippet for user page', () => {
        expect(wrapper).toMatchSnapshot()
    })

    it('should call addUserSnippet on valid input', () => {
        const value = ['.test', 'This is a test']
        const target = { 
            children: [ 
                { textContent: value[0], focus: () => {} },
                { innerHTML: value[1] }
        ]}
        wrapper.find('#add-snippet-form').simulate('submit', {
            preventDefault: () => {},
            target
        })
        expect(addUserSnippet).toHaveBeenLastCalledWith({
            shortcut: value[0], text: value[1]
        })
    })
})

describe('team snippets page', () => {
    beforeEach(() => {
        addTeamSnippet = jest.fn()
        updateTeamSnippets = jest.fn()
        wrapper = shallow(<AddSnippet {...teamState} 
                        addTeamSnippet={addTeamSnippet}
                        />)
    })

    it('should render AddSnippet for team page', () => {
        expect(wrapper).toMatchSnapshot()
    })

    it('should call addTeamSnippet on valid input', () => {
        const value = ['.test', 'This is a test']
        const target = { 
            children: [ 
                { textContent: value[0], focus: () => {} },
                { innerHTML: value[1] }
        ]}
        wrapper.find('#add-snippet-form').simulate('submit', {
            preventDefault: () => {},
            target
        })
        expect(addTeamSnippet).toHaveBeenLastCalledWith(teamState.team, {
            shortcut: value[0], text: value[1]
        })
    })
})

describe('existing snippet data', () => {
    it('should render user AddSnippet with snippet', () => {
        wrapper = shallow(<AddSnippet 
                        userAddSnippet={userAddSnippet} 
                        { ...userState } />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should render team AddSnippet with snippet', () => {
        wrapper = shallow(<AddSnippet 
                        teamAddSnippets={teamAddSnippets}
                        { ...teamState } />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should call updateUserSnippet on unmount', () => {
        wrapper = mount(<AddSnippet {...userState}
                        userAddSnippet={userAddSnippet}
                        updateUserSnippet={updateUserSnippet} />)
        wrapper.unmount()
        expect(updateUserSnippet).toHaveBeenLastCalledWith(userAddSnippet)
    })

    it('should call updateTeamSnippets on unmount', () => {
        wrapper = mount(<AddSnippet {...teamState}
                        teamAddSnippets={teamAddSnippets}
                        updateTeamSnippets={updateTeamSnippets} />)
        wrapper.unmount()
        expect(updateTeamSnippets)
                .toHaveBeenLastCalledWith(teamState.team, teamAddSnippets[teamState.team])
    })
})
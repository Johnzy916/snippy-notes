import React from 'react'
import { shallow } from 'enzyme'
import { TeamSnippetPage } from '../../components/TeamSnippetPage'
import { teamSnippets } from '../fixtures/snippets'
import data from '../fixtures/adminData'

it('should render TeamSnippetPage without AddSnippet module', () => {
    const props = { isTeamAdmin: [], teamSnippets }
    const wrapper = shallow(<TeamSnippetPage { ...props } />)
    expect(wrapper).toMatchSnapshot()
})

it('should render TeamSnippetPage with AddSnippet modules for every team', () => {
    const props = { isSuperAdmin: true, teamSnippets, isTeamAdmin: [] }
    const wrapper = shallow(<TeamSnippetPage { ...props } />)
    expect(wrapper).toMatchSnapshot()
})

it('should render TeamSnippetPage with AddSnippet modules specific teams', () => {
    const props = { isTeamAdmin: data.isTeamAdmin, teamSnippets }
    const wrapper = shallow(<TeamSnippetPage { ...props } />)
    expect(wrapper).toMatchSnapshot()
})
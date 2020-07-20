import React from 'react'
import { shallow } from 'enzyme'
import { SnippetPage } from '../../components/SnippetPage'
import { teamSnippets } from '../fixtures/snippets'

it('should render SnippetPage without team snippets link', () => {
    const wrapper = shallow(<SnippetPage />)
    expect(wrapper).toMatchSnapshot()
})

it('should render SnippetPage with team snippets link', () => {
    const props = { isSuperAdmin: true, teamSnippets }
    const wrapper = shallow(<SnippetPage { ...props } />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('Link').at(0).prop('to')).toBe('/team')
})
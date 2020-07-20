import React from 'react'
import { shallow } from 'enzyme'
import { userSnippets, teamSnippets } from '../fixtures/snippets'
import { SnippetList } from '../../components/SnippetList'

let wrapper

describe('user snippets', () => {
    it('should render SnippetList with no snippets', () => {
        wrapper = shallow(<SnippetList snippets={[]} />)
        expect(wrapper).toMatchSnapshot()
    })
    
    it('should render SnippetList with snippets', () => {
        wrapper = shallow(<SnippetList snippets={userSnippets} />)
        expect(wrapper).toMatchSnapshot()
    })
})

describe('team snippets', () => {
    it('should render SnippetList as non-admin with no snippets', () => {
        const props = { team: 'team', isTeamAdmin: [], teamSnippets: {}}
        wrapper = shallow(<SnippetList { ...props } />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should render SnippetList as admin with no snippets', () => {
        const props = { team: 'team', isTeamAdmin: [ 'team' ], teamSnippets: {}}
        wrapper = shallow(<SnippetList { ...props } />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should render SnippetList as non-admin with snippets', () => {
        const props = { team: 'team', isTeamAdmin: [], teamSnippets }
        wrapper = shallow(<SnippetList { ...props } />)
        expect(wrapper).toMatchSnapshot()
    })

    it('should render SnippetList as admin with snippets', () => {
        const props = { team: 'team', isTeamAdmin: [ 'team' ], teamSnippets }
        wrapper = shallow(<SnippetList { ...props } />)
        expect(wrapper).toMatchSnapshot()
    })
})
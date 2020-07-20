import React from 'react'
import { shallow } from 'enzyme'
import { AdminPage } from '../../components/AdminPage'
import data from '../fixtures/adminData'

const shallowRender = (adminType, changes = {}) => {
    const state = { ...data, [adminType]: true, ...changes }
    return shallow(<AdminPage { ...state } />)
}

it('renders AdminPage correctly for superAdmins', () => {
    const wrapper = shallowRender('isSuperAdmin')
    expect(wrapper).toMatchSnapshot()
});

it('renders AdminPage correctly for superAdmins with no projects', () => {
    const wrapper = shallowRender('isSuperAdmin', 
                    { allProjects: [], currentProject: '',
                      allTeams: [], teamMembers: {} })
    expect(wrapper).toMatchSnapshot()
});

it('renders AdminPage correctly for superAdmins with no teams', () => {
    const wrapper = shallowRender('isSuperAdmin', 
                    { allTeams: [], teamMembers: {} })
    expect(wrapper).toMatchSnapshot()
});

it('renders AdminPage correctly for projectAdmins', () => {
    const wrapper = shallowRender('isProjectAdmin')
    expect(wrapper).toMatchSnapshot()
});

it('renders AdminPage correctly for projectAdmins with no teams', () => {
    const wrapper = shallowRender('isProjectAdmin',
                    { allTeams: [], teamMembers: {} })
    expect(wrapper).toMatchSnapshot()
});

it('renders AdminPage correctly for teamAdmins', () => {
    const wrapper = shallowRender('isTeamAdmin')
    expect(wrapper).toMatchSnapshot()
});
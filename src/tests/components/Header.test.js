import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../../components/Header'

const state = { userName: 'User' }

let wrapper, startLogout

describe('with admin button', () => {
  beforeEach(() => {
    startLogout = jest.fn()
    const props = { ...state, isSuperAdmin: true }
    wrapper = mount(
      <MemoryRouter initialEntries={[ { pathname: '/notes', key: 'test' } ]}>
          <Header startLogout={startLogout} { ...props } />
      </MemoryRouter>
    )
  })

  it('should render Header with Admin button', () => {
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })

  it('should include link to Admin page', () => {
    expect(wrapper.find('Link').at(1).prop('to')).toBe('/admin')
  });
});

describe('without admin button', () => {
  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={[ { pathname: '/notes', key: 'test' } ]}>
          <Header startLogout={startLogout} { ...state } />
      </MemoryRouter>
    )
  })

  it('should render Header without Admin button', () => {
    expect(wrapper).toMatchSnapshot()
    wrapper.unmount()
  })

  it('should call startLogout on button click', () => {
    wrapper.find('.btn--primary').simulate('click')
    expect(startLogout).toHaveBeenCalled()
    wrapper.unmount()
  })
});


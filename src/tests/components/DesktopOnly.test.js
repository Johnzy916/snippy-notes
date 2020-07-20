import React from 'react'
import { shallow } from 'enzyme'
import DesktopOnly from '../../components/DesktopOnly'

it('should render DesktopOnly correctly', () => {
    const wrapper = shallow(<DesktopOnly />)
    expect(wrapper).toMatchSnapshot()
});
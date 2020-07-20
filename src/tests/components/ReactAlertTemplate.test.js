import React from 'react'
import { shallow } from 'enzyme'
import ReactAlertTemplate, {
    InfoIcon, SuccessIcon, ErrorIcon, CloseIcon, BaseIcon
} from '../../components/ReactAlertTemplate'

const baseProps = {
    message: 'message',
    style: {},
    close: jest.fn(),
    options: [
        { type: 'info' },
        { type: 'success' },
        { type: 'error' }
    ]
}

it('should render InfoIcon', () => {
    const wrapper = shallow(<InfoIcon />)
    expect(wrapper).toMatchSnapshot()
});

it('should render SuccessIcon', () => {
    const wrapper = shallow(<SuccessIcon />)
    expect(wrapper).toMatchSnapshot()
});

it('should render ErrorIcon', () => {
    const wrapper = shallow(<ErrorIcon />)
    expect(wrapper).toMatchSnapshot()
});

it('should render CloseIcon', () => {
    const wrapper = shallow(<CloseIcon />)
    expect(wrapper).toMatchSnapshot()
});

it('should render InfoIcon', () => {
    const wrapper = shallow(<InfoIcon />)
    expect(wrapper).toMatchSnapshot()
});

it('should render BaseIcon', () => {
    const props = {
        color: 'blue',
        pushRight: true,
        children: null
    }
    const wrapper = shallow(<BaseIcon {...props} />)
    expect(wrapper).toMatchSnapshot()
});

it('should render alert template with InfoIcon', () => {
    const props = {
        ...baseProps,
        options: baseProps.options[0]
    }
    const wrapper = shallow(<ReactAlertTemplate {...props} />)
    expect(wrapper).toMatchSnapshot()
});

it('should render alert template with SuccessIcon', () => {
    const props = {
        ...baseProps,
        options: baseProps.options[1]
    }
    const wrapper = shallow(<ReactAlertTemplate {...props} />)
    expect(wrapper).toMatchSnapshot()
});

it('should render alert template with ErrorIcon', () => {
    const props = {
        ...baseProps,
        options: baseProps.options[2]
    }
    const wrapper = shallow(<ReactAlertTemplate {...props} />)
    expect(wrapper).toMatchSnapshot()
});
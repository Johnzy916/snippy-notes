import React from 'react'
import { shallow } from 'enzyme'
import { Notes } from '../../components/Notes'
import { keyUpHandler } from '../../utils/trackTyping'
import { copyText, pasteText } from '../../utils/clipboard'

jest.mock('../../utils/trackTyping')
jest.mock('../../utils/clipboard')

const note = 'This is a note'

let wrapper, update, event

describe('without note', () => {
    beforeEach(() => {
        update = jest.fn()
        event = {
            preventDefault: () => {},
            clipboardData: { getData: () => jest.fn() }
        }
        wrapper = shallow(<Notes update={update} />)
    })

    it('should render Notes correctly without note', () => {
        expect(wrapper).toMatchSnapshot()
    })

    it('should call pasteText on paste', () => {
        wrapper.find('.input-div').simulate('paste', event)
        expect(pasteText).toHaveBeenLastCalledWith(event)
    })

    it('should call keyUpHandler on key up', () => {
        wrapper.find('.input-div').simulate('keyup', event)
        expect(keyUpHandler).toHaveBeenLastCalledWith(event)
    });
})

describe('with note', () => {
    beforeEach(() => {
        update = jest.fn()
        wrapper = shallow(<Notes note={note} update={update} />)
    })

    it('should render Notes with a note', () => {
        expect(wrapper).toMatchSnapshot()
    })

    it('should call copyText on copy', () => {
        wrapper.find('.input-div').simulate('copy', event)
        expect(copyText).toHaveBeenCalled()
    });
});
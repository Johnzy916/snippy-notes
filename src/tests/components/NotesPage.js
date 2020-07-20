import React from 'react';
import { shallow } from 'enzyme';
import NotesPage from '../../components/NotesPage';

test('should render the notes page correctly', () => {
  const wrapper = shallow(<NotesPage />);
  expect(wrapper).toMatchSnapshot();
});
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const { container } = render(<Note note={note} />)
  const li = container.querySelector('[data-testid="custom-element"')

  //* screen.debug(li) -> Object screen has method debug that can be used to print the HTML of a component to the terminal.
  expect(li).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('not important', { exact: false }) //Or const element = await screen.findByText('Does not work anymore :('); careful it returns promise!
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})
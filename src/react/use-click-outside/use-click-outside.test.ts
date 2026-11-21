// @vitest-environment happy-dom
import { renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useClickOutside } from './use-click-outside';

const addButton = (name: string) => {
  const button = document.createElement('button');
  button.textContent = name;
  document.body.append(button);
  return button;
};

describe('useClickOutside', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('calls the handler on a click outside the element', async () => {
    const user = userEvent.setup();
    const menu = addButton('Menu');
    addButton('Outside');
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside({ current: menu }, { onClickOutside }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks inside the element', async () => {
    const user = userEvent.setup();
    const menu = addButton('Menu');
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside({ current: menu }, { onClickOutside }));
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('treats every element in a list of refs as inside', async () => {
    const user = userEvent.setup();
    const menu = addButton('Menu');
    const toggle = addButton('Toggle');
    addButton('Outside');
    const onClickOutside = vi.fn();
    renderHook(() => useClickOutside([{ current: menu }, { current: toggle }], { onClickOutside }));
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(onClickOutside).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('stops listening on unmount', async () => {
    const user = userEvent.setup();
    const menu = addButton('Menu');
    addButton('Outside');
    const onClickOutside = vi.fn();
    const { unmount } = renderHook(() => useClickOutside({ current: menu }, { onClickOutside }));
    unmount();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(onClickOutside).not.toHaveBeenCalled();
  });
});

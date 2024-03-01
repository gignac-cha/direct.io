import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './components/Root';

const createRootElement = (id: string) => {
  const root = document.createElement('div');
  root.setAttribute('id', id);
  return document.body.appendChild(root);
};

export const initializeRoot = () =>
  createRoot(
    document.querySelector('#root') ?? createRootElement('root'),
  ).render(createElement(Root));

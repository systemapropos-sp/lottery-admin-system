/**
 * Modal stubs — the full modal system is not needed in the admin context.
 * All modals are stubbed as no-ops so the Dashboard compiles without the full modal stack.
 */
import React from 'react';

export function useModalContext() {
  return {
    openModal: (_type?: string) => {},
    closeModal: (_type?: string) => {},
    activeModals: [] as string[],
  };
}

// ModalProvider: just renders children
export function ModalProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}

// ModalManager: renders nothing
export function ModalManager() {
  return null;
}

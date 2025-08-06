import { useCallback, useState } from 'react';

/**
 * Configuration object for the confirm modal.
 *
 * @typedef {Object} ModalConfig
 * @property {string} header - The title/header of the modal.
 * @property {string} body - The main content or message body of the modal.
 * @property {'danger' | 'success' | 'secondary'} color - Color theme of the modal.
 * @property {string} text - The label for the confirm button.
 * @property {() => Promise<void>} action - The async function to execute when user confirms.
 */
type ModalConfig = {
  header: string;
  body: string;
  color: 'danger' | 'success' | 'secondary';
  text: string;
  action: () => Promise<void>;
};

/**
 * A custom hook to manage a reusable confirmation modal.
 *
 * @returns {{
 *   isOpen: boolean,
 *   config: ModalConfig | null,
 *   loading: boolean,
 *   openModal: (config: ModalConfig) => void,
 *   closeModal: () => void,
 *   confirmAction: () => Promise<void>
 * }} Hook result with modal control state and handlers.
 *
 * @example
 * const {
 *   isOpen,
 *   config,
 *   loading,
 *   openModal,
 *   closeModal,
 *   confirmAction
 * } = useConfirmModal();
 *
 * openModal({
 *   header: 'Delete Item',
 *   body: 'Are you sure you want to delete this item?',
 *   color: 'danger',
 *   text: 'Delete',
 *   action: async () => { await deleteItem(); }
 * });
 */
export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback((config: ModalConfig) => {
    setConfig(config);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setConfig(null);
  }, []);

  const confirmAction = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      await config.action();
      closeModal();
    } catch (err) {
      // enhance error handling/logging here
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [config, closeModal]);

  return {
    isOpen,
    config,
    loading,
    openModal,
    closeModal,
    confirmAction,
  };
}

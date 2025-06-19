const parentOrigin = import.meta.env.VITE_PARENT_IFRAME_ORIGIN as string;

export const sendMessageToParent = <T = any>(message: T, targetOrigin = parentOrigin) => {
  if (!window?.parent) {
    return console.warn("Parent window is not available.")
  }

  window.parent.postMessage(message, targetOrigin);
};

export const listenParentMessage = <T = any>(listener: (event: MessageEvent<T>) => void, targetOrigin = parentOrigin) => {
  const safeListener = (event: MessageEvent<T>) => {
    if (event.origin !== targetOrigin) return;
    listener(event);
  };
  window.addEventListener("message", safeListener);
  return () => window.removeEventListener("message", safeListener);
}

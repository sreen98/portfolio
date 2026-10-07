import { useSyncExternalStore, type ReactNode } from "react";

const noop = () => () => {};

/**
 * Renders children only in the browser. The pre-rendered HTML and the first
 * client render both output nothing, so hydration matches; browser-only work
 * (WebGL effects) then mounts straight after.
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return isClient ? children : null;
}

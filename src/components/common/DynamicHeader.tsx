import { useEffect, useState, type ReactNode } from "react";
import ReactDOM from "react-dom";

export default function DynamicHeader({ children }: { children?: ReactNode }) {
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  useEffect(() => {
    const el = document.getElementById("dynamic-header");
    if (el) {
      setTargetElement(el);
    }
  }, []);
  if (!targetElement) {
    return null;
  }

  return ReactDOM.createPortal(<>{children}</>, targetElement);
}

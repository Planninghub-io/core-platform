
/// <reference types="vite/client" />

// Add langflow-chat custom element declaration
declare namespace JSX {
  interface IntrinsicElements {
    'langflow-chat': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      window_title?: string;
      flow_id?: string;
      host_url?: string;
    };
  }
}

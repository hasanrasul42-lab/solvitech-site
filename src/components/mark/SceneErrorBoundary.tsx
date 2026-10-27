"use client";

import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Swaps the WebGL canvas for a static fallback if rendering throws. */
export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[3d] scene failed to render", error);
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

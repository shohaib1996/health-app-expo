import { Component, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Wraps the whole app (app/_layout.tsx). Without this, an unhandled
 * render error anywhere crashes to a bare red screen with no way back
 * in — this instead shows plain copy matching the app's own voice
 * (calm, not apologetic) and a reset button that clears the error and
 * re-renders the tree fresh.
 *
 * Deliberately doesn't report to a crash service — Sentry isn't wired
 * up anywhere in this app yet, matching the backend, which explicitly
 * won't wire Sentry until its safety-path scrub is in place (§5.10).
 * Wire this boundary's componentDidCatch into that same integration
 * when it lands, not before.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-bg px-8">
          <Text className="text-center font-heading text-h4 text-text">Something went wrong.</Text>
          <Text className="mt-3 text-center font-body text-body-sm text-neutral-400">
            Nothing you logged was lost — it's still on this phone. Try again.
          </Text>
          <View className="mt-8 w-full">
            <Button label="Try again" onPress={this.reset} block />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

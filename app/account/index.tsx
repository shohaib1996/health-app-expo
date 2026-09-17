import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button, TextField } from '@/components/ui';
import { authApi } from '@/features/auth/authApi';
import { logout, setIdentity } from '@/features/auth/authSlice';
import { useMe } from '@/features/users/useMe';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

/**
 * S-57 — anonymous by default. Linking preserves all data (it attaches
 * an identity to the existing account, never creates a new one — the
 * spec's category-killing-bug line about losing data at sign-in
 * applies here). Sign-out clears local session tokens only; the
 * device's SQLite data is untouched, since the device is the source
 * of truth regardless of session state.
 */
export default function AccountScreen() {
  const dispatch = useAppDispatch();
  const isAnonymous = useAppSelector((s) => s.auth.isAnonymous);
  const { user, loading, refresh } = useMe();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [linking, setLinking] = useState(false);

  const handleLink = async () => {
    if (!email.trim() || password.length < 8) {
      Alert.alert('Check your details', 'Email and a password of at least 8 characters are required.');
      return;
    }
    setLinking(true);
    try {
      const linkedUser = await authApi.link({ provider: 'email', email: email.trim(), password });
      dispatch(setIdentity({ userId: linkedUser.id, isAnonymous: linkedUser.isAnonymous }));
      await refresh();
    } catch {
      Alert.alert("Couldn't sign in", 'Check your details and try again.');
    } finally {
      setLinking(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'You will need to restart the app to continue anonymously.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          void dispatch(logout());
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-6" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center">
        <Text className="font-heading text-h3 text-text">Account</Text>

        {loading && <Text className="mt-4 font-body text-body-sm text-neutral-400">Loading…</Text>}

        {!loading && isAnonymous && (
          <>
            <Text className="mt-2 font-body text-body-sm text-neutral-400">
              Your entries stay on this phone only. Sign in to encrypt and copy them to a server so you can
              restore them — without this, losing the phone means losing everything.
            </Text>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="mt-6"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="mt-4"
            />
            <Button
              label={linking ? 'Signing in…' : 'Sign in'}
              onPress={handleLink}
              disabled={linking}
              className="mt-6"
            />
          </>
        )}

        {!loading && !isAnonymous && (
          <>
            <Text className="mt-2 font-body text-body-sm text-neutral-400">Email</Text>
            <Text className="mt-1 font-body text-body text-text">{user?.email ?? '—'}</Text>
            <Button label="Sign out" variant="secondary" onPress={handleSignOut} className="mt-8" />
          </>
        )}
      </View>
      <View className="pb-4">
        <Button label="Close" variant="ghost" onPress={() => router.back()} block />
      </View>
    </SafeAreaView>
  );
}

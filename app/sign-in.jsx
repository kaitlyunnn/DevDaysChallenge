import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Redirect } from 'expo-router'
import { useSession } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { colors, shared } from '../lib/theme'

export default function SignIn() {
  const { session, loading } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (loading) {
    return (
      <View style={[shared.screen, { justifyContent: 'center' }]}>
        <ActivityIndicator />
      </View>
    )
  }
  if (session) return <Redirect href="/" />

  async function submit(mode) {
    setBusy(true)
    setError(null)
    setStatus(null)

    const { error } =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)
    else if (mode === 'signup') setStatus('Check your email to confirm your account.')

    setBusy(false)
  }

  return (
    <KeyboardAvoidingView
      style={shared.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[shared.container, { justifyContent: 'center' }]}>
        <Text style={shared.title}>Sign in</Text>

        <TextInput
          style={shared.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          inputMode="email"
        />

        <TextInput
          style={shared.input}
          placeholder="Password"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

        <Pressable
          style={[shared.button, busy && shared.disabled]}
          disabled={busy}
          onPress={() => submit('signin')}
        >
          <Text style={shared.buttonText}>{busy ? 'Working…' : 'Sign in'}</Text>
        </Pressable>

        <Pressable
          style={[shared.button, shared.buttonSecondary, busy && shared.disabled]}
          disabled={busy}
          onPress={() => submit('signup')}
        >
          <Text style={[shared.buttonText, shared.buttonSecondaryText]}>Create account</Text>
        </Pressable>

        {error && <Text style={shared.error}>{error}</Text>}
        {status && <Text style={shared.muted}>{status}</Text>}
      </View>
    </KeyboardAvoidingView>
  )
}

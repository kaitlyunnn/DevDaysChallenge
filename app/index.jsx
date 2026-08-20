import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Redirect } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { apiFetch } from '../lib/api'
import { useSession } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { colors, shared } from '../lib/theme'

export default function Home() {
  const { session, loading } = useSession()
  const insets = useSafeAreaInsets()
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (loading) {
    return (
      <View style={[shared.screen, { justifyContent: 'center' }]}>
        <ActivityIndicator />
      </View>
    )
  }
  if (!session) return <Redirect href="/sign-in" />

  async function send() {
    setBusy(true)
    setError(null)
    setAnswer('')

    try {
      const { text } = await apiFetch('/api/generate', {
        method: 'POST',
        body: { prompt },
      })
      setAnswer(text)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[shared.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={shared.container} keyboardShouldPersistTaps="handled">
        <View style={shared.row}>
          <Text style={shared.title}>Ask Gemini</Text>
          <Pressable onPress={() => supabase.auth.signOut()}>
            <Text style={shared.muted}>Sign out</Text>
          </Pressable>
        </View>

        <Text style={shared.muted}>{session.user.email}</Text>

        <TextInput
          style={[shared.input, { minHeight: 100, textAlignVertical: 'top' }]}
          placeholder="Ask something…"
          placeholderTextColor={colors.muted}
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />

        <Pressable
          style={[shared.button, (busy || !prompt.trim()) && shared.disabled]}
          disabled={busy || !prompt.trim()}
          onPress={send}
        >
          <Text style={shared.buttonText}>{busy ? 'Thinking…' : 'Send'}</Text>
        </Pressable>

        {error && <Text style={shared.error}>{error}</Text>}

        {answer ? (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text selectable style={{ color: colors.text, lineHeight: 22 }}>
              {answer}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

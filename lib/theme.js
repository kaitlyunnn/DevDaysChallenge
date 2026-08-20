import { StyleSheet } from 'react-native'

export const colors = {
  bg: '#ffffff',
  text: '#11181c',
  muted: '#687076',
  border: '#d7dbdf',
  accent: '#0a7ea4',
  accentText: '#ffffff',
  error: '#d32f2f',
  surface: '#f5f7f9',
}

export const shared = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // Keeps content readable on a phone and centred on a wide browser window.
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.bg,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.accentText,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonSecondaryText: {
    color: colors.text,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: colors.error,
  },
  muted: {
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
})

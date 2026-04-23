import { describe, expect, it } from 'vitest'
import { OLLAMA_MODEL } from './ollamaClient'

describe('ollamaClient model configuration', () => {
  it('uses the Jackrong distilled Qwen3.5 4B GGUF model alias', () => {
    expect(OLLAMA_MODEL).toBe('jackrong-qwen3.5-4b-claude-4.6-opus-distilled-v2:q4_k_m')
  })
})

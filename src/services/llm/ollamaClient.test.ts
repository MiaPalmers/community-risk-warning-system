import { describe, expect, it } from 'vitest'
import { OLLAMA_MODEL, parseVlmResponse } from './ollamaClient'

describe('ollamaClient model configuration', () => {
  it('uses the Jackrong distilled Qwen3.5 4B GGUF model alias', () => {
    expect(OLLAMA_MODEL).toBe('jackrong-qwen3.5-4b-claude-4.6-opus-distilled-v2:q4_k_m')
  })
})

describe('parseVlmResponse', () => {
  it('drops detection boxes with missing size or confidence fields', () => {
    const result = parseVlmResponse(JSON.stringify({
      hasRisk: true,
      riskScore: 70,
      level: 'B',
      confidence: 0.8,
      summary: 'risk found',
      evidenceTimeline: [],
      breakdown: [{ label: 'risk', value: 100 }],
      detectionBoxes: [
        { x: 0.1, y: 0.2, width: 0.3, height: 0.4, label: 'valid', confidence: 0.9, risk: true },
        { x: 0.1, y: 0.2, height: 0.4, label: 'missing width', confidence: 0.9, risk: true },
        { x: 0.1, y: 0.2, width: 0.3, label: 'missing height', confidence: 0.9, risk: true },
        { x: 0.1, y: 0.2, width: 0.3, height: 0.4, label: 'missing confidence', risk: true }
      ]
    }))

    expect(result.boxes).toEqual([
      { x: 0.1, y: 0.2, width: 0.3, height: 0.4, label: 'valid', confidence: 0.9, risk: true }
    ])
  })

  it('clamps numeric detection box fields and defaults missing risk to false', () => {
    const result = parseVlmResponse(JSON.stringify({
      hasRisk: true,
      riskScore: 70,
      level: 'B',
      confidence: 0.8,
      summary: 'risk found',
      evidenceTimeline: [],
      breakdown: [{ label: 'risk', value: 100 }],
      detectionBoxes: [
        { x: -0.2, y: 1.2, width: 2, height: 0.5, label: 'out of bounds', confidence: 1.5 }
      ]
    }))

    expect(result.boxes).toEqual([
      { x: 0, y: 1, width: 1, height: 0.5, label: 'out of bounds', confidence: 1, risk: false }
    ])
  })

  it('drops detection boxes with non-finite numeric fields', () => {
    const result = parseVlmResponse(JSON.stringify({
      hasRisk: true,
      riskScore: 70,
      level: 'B',
      confidence: 0.8,
      summary: 'risk found',
      evidenceTimeline: [],
      breakdown: [{ label: 'risk', value: 100 }],
      detectionBoxes: [
        { x: 'bad', y: 0.2, width: 0.3, height: 0.4, label: 'invalid', confidence: 0.9, risk: true },
        { x: 0.1, y: 0.2, width: 0.3, height: 0.4, label: 'valid', confidence: 0.9, risk: true }
      ]
    }))

    expect(result.boxes).toEqual([
      { x: 0.1, y: 0.2, width: 0.3, height: 0.4, label: 'valid', confidence: 0.9, risk: true }
    ])
  })
})

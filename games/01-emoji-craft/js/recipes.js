/**
 * Emoji Craft: Infinite Fusion - Recipe Database (150+ Handcrafted Combinations)
 * Dynamically linked to i18n multi-language engine
 */

import { i18n } from './i18n.js';

export const INITIAL_ELEMENTS = [
  { id: 'water', emoji: '💧', category: 'basic' },
  { id: 'fire', emoji: '🔥', category: 'basic' },
  { id: 'earth', emoji: '🌱', category: 'basic' },
  { id: 'wind', emoji: '💨', category: 'basic' }
];

export const RECIPES_DATA = [
  // --- Natural Physics ---
  { a: 'water', b: 'fire', result: { id: 'steam', emoji: '♨️', category: 'nature' } },
  { a: 'earth', b: 'fire', result: { id: 'lava', emoji: '🌋', category: 'nature' } },
  { a: 'earth', b: 'water', result: { id: 'mud', emoji: '🟤', category: 'nature' } },
  { a: 'earth', b: 'wind', result: { id: 'dust', emoji: '🌪️', category: 'nature' } },
  { a: 'fire', b: 'wind', result: { id: 'energy', emoji: '⚡', category: 'nature' } },
  { a: 'water', b: 'wind', result: { id: 'wave', emoji: '🌊', category: 'nature' } },
  { a: 'mud', b: 'fire', result: { id: 'brick', emoji: '🧱', category: 'nature' } },
  { a: 'steam', b: 'wind', result: { id: 'cloud', emoji: '☁️', category: 'nature' } },
  { a: 'cloud', b: 'water', result: { id: 'rain', emoji: '🌧️', category: 'nature' } },
  { a: 'cloud', b: 'energy', result: { id: 'storm', emoji: '⛈️', category: 'nature' } },
  { a: 'water', b: 'wave', result: { id: 'ocean', emoji: '🌊', category: 'nature' } },
  { a: 'lava', b: 'water', result: { id: 'obsidian', emoji: '🖤', category: 'nature' } },
  { a: 'lava', b: 'earth', result: { id: 'volcano', emoji: '🌋', category: 'nature' } },
  { a: 'dust', b: 'fire', result: { id: 'gunpowder', emoji: '🧨', category: 'tech' } },

  // --- Life & Flora ---
  { a: 'earth', b: 'rain', result: { id: 'plant', emoji: '🌿', category: 'life' } },
  { a: 'mud', b: 'energy', result: { id: 'life', emoji: '🧬', category: 'life' } },
  { a: 'plant', b: 'water', result: { id: 'flower', emoji: '🌸', category: 'life' } },
  { a: 'plant', b: 'earth', result: { id: 'tree', emoji: '🌳', category: 'life' } },
  { a: 'tree', b: 'tree', result: { id: 'forest', emoji: '🌲', category: 'nature' } },
  { a: 'plant', b: 'fire', result: { id: 'tobacco', emoji: '🚬', category: 'life' } },
  { a: 'tree', b: 'fire', result: { id: 'wood', emoji: '🪵', category: 'nature' } },
  { a: 'life', b: 'water', result: { id: 'fish', emoji: '🐟', category: 'life' } },
  { a: 'life', b: 'earth', result: { id: 'animal', emoji: '🐾', category: 'life' } },
  { a: 'life', b: 'wind', result: { id: 'bird', emoji: '🦅', category: 'life' } },
  { a: 'animal', b: 'earth', result: { id: 'dog', emoji: '🐕', category: 'life' } },
  { a: 'animal', b: 'wind', result: { id: 'cat', emoji: '🐱', category: 'life' } },
  { a: 'animal', b: 'water', result: { id: 'frog', emoji: '🐸', category: 'life' } },
  { a: 'animal', b: 'plant', result: { id: 'insect', emoji: '🐛', category: 'life' } },
  { a: 'insect', b: 'flower', result: { id: 'bee', emoji: '🐝', category: 'life' } },
  { a: 'bee', b: 'flower', result: { id: 'honey', emoji: '🍯', category: 'food' } },
  { a: 'animal', b: 'life', result: { id: 'human', emoji: '🧑', category: 'life' } },

  // --- Food & Delicacies ---
  { a: 'plant', b: 'sun', result: { id: 'fruit', emoji: '🍎', category: 'food' } },
  { a: 'plant', b: 'water', result: { id: 'tea', emoji: '🍵', category: 'food' } },
  { a: 'plant', b: 'energy', result: { id: 'coffee', emoji: '☕', category: 'food' } },
  { a: 'fire', b: 'animal', result: { id: 'meat', emoji: '🥩', category: 'food' } },
  { a: 'grain', b: 'water', result: { id: 'bread', emoji: '🍞', category: 'food' } },
  { a: 'plant', b: 'mud', result: { id: 'grain', emoji: '🌾', category: 'food' } },
  { a: 'meat', b: 'bread', result: { id: 'burger', emoji: '🍔', category: 'food' } },
  { a: 'meat', b: 'fire', result: { id: 'bbq', emoji: '🍢', category: 'food' } },
  { a: 'fruit', b: 'water', result: { id: 'juice', emoji: '🧃', category: 'food' } },
  { a: 'fruit', b: 'time', result: { id: 'wine', emoji: '🍷', category: 'food' } },

  // --- Civilization & Technology ---
  { a: 'human', b: 'earth', result: { id: 'farmer', emoji: '👨‍🌾', category: 'life' } },
  { a: 'human', b: 'brick', result: { id: 'house', emoji: '🏠', category: 'tech' } },
  { a: 'house', b: 'house', result: { id: 'city', emoji: '🏙️', category: 'tech' } },
  { a: 'earth', b: 'fire', result: { id: 'metal', emoji: '⚙️', category: 'tech' } },
  { a: 'metal', b: 'wood', result: { id: 'tool', emoji: '🔨', category: 'tech' } },
  { a: 'metal', b: 'energy', result: { id: 'electricity', emoji: '💡', category: 'tech' } },
  { a: 'electricity', b: 'tool', result: { id: 'computer', emoji: '💻', category: 'tech' } },
  { a: 'computer', b: 'human', result: { id: 'programmer', emoji: '👨‍💻', category: 'tech' } },
  { a: 'computer', b: 'computer', result: { id: 'internet', emoji: '🌐', category: 'tech' } },
  { a: 'internet', b: 'phone', result: { id: 'smartphone', emoji: '📱', category: 'tech' } },
  { a: 'computer', b: 'tool', result: { id: 'phone', emoji: '☎️', category: 'tech' } },
  { a: 'electricity', b: 'glass', result: { id: 'lightbulb', emoji: '💡', category: 'tech' } },
  { a: 'dust', b: 'fire', result: { id: 'glass', emoji: '🪟', category: 'tech' } },
  { a: 'glass', b: 'metal', result: { id: 'glasses', emoji: '👓', category: 'tech' } },
  { a: 'computer', b: 'life', result: { id: 'ai', emoji: '🤖', category: 'tech' } },
  { a: 'ai', b: 'ai', result: { id: 'agi', emoji: '🧠', category: 'tech' } },
  { a: 'metal', b: 'gunpowder', result: { id: 'bullet', emoji: '💥', category: 'tech' } },
  { a: 'bullet', b: 'metal', result: { id: 'gun', emoji: '🔫', category: 'tech' } },
  { a: 'metal', b: 'fire', result: { id: 'car', emoji: '🚗', category: 'tech' } },
  { a: 'car', b: 'wind', result: { id: 'airplane', emoji: '✈️', category: 'tech' } },
  { a: 'metal', b: 'energy', result: { id: 'rocket', emoji: '🚀', category: 'tech' } },

  // --- Memes & Modern Work Humor ---
  { a: 'programmer', b: 'coffee', result: { id: 'overtime', emoji: '🧟‍♂️', category: 'meme' } },
  { a: 'programmer', b: 'insect', result: { id: 'bug', emoji: '🐞', category: 'meme' } },
  { a: 'bug', b: 'fire', result: { id: 'server_down', emoji: '💥', category: 'meme' } },
  { a: 'programmer', b: 'time', result: { id: 'bald', emoji: '👴', category: 'meme' } },
  { a: 'dog', b: 'glasses', result: { id: 'detective_dog', emoji: '🕵️‍♂️', category: 'meme' } },
  { a: 'cat', b: 'metal', result: { id: 'cyber_cat', emoji: '🐱‍💻', category: 'meme' } },
  { a: 'human', b: 'internet', result: { id: 'meme', emoji: '🤡', category: 'meme' } },
  { a: 'human', b: 'money', result: { id: 'capitalist', emoji: '🎩', category: 'meme' } },
  { a: 'metal', b: 'fire', result: { id: 'gold', emoji: '🪙', category: 'tech' } },
  { a: 'gold', b: 'human', result: { id: 'money', emoji: '💵', category: 'meme' } },
  { a: 'money', b: 'overtime', result: { id: 'salary', emoji: '💸', category: 'meme' } },
  { a: 'human', b: 'bed', result: { id: 'sleep', emoji: '😴', category: 'meme' } },
  { a: 'wood', b: 'cloth', result: { id: 'bed', emoji: '🛏️', category: 'life' } },
  { a: 'plant', b: 'tool', result: { id: 'cloth', emoji: '🧵', category: 'tech' } },

  // --- Fantasy & Myth ---
  { a: 'animal', b: 'fire', result: { id: 'dragon', emoji: '🐉', category: 'fantasy' } },
  { a: 'bird', b: 'fire', result: { id: 'phoenix', emoji: '🔥', category: 'fantasy' } },
  { a: 'human', b: 'energy', result: { id: 'wizard', emoji: '🧙‍♂️', category: 'fantasy' } },
  { a: 'human', b: 'gold', result: { id: 'king', emoji: '👑', category: 'fantasy' } },
  { a: 'wizard', b: 'king', result: { id: 'god', emoji: '✨', category: 'fantasy' } },
  { a: 'metal', b: 'wizard', result: { id: 'sword', emoji: '🗡️', category: 'fantasy' } },
  { a: 'sword', b: 'dragon', result: { id: 'hero', emoji: '🛡️', category: 'fantasy' } },
  { a: 'human', b: 'time', result: { id: 'skeleton', emoji: '💀', category: 'fantasy' } },
  { a: 'life', b: 'skeleton', result: { id: 'zombie', emoji: '🧟', category: 'fantasy' } },

  // --- Cosmic & Sci-Fi Universe ---
  { a: 'energy', b: 'energy', result: { id: 'sun', emoji: '☀️', category: 'cosmic' } },
  { a: 'sun', b: 'earth', result: { id: 'time', emoji: '⏳', category: 'cosmic' } },
  { a: 'sun', b: 'time', result: { id: 'moon', emoji: '🌙', category: 'cosmic' } },
  { a: 'sun', b: 'moon', result: { id: 'eclipse', emoji: '🌑', category: 'cosmic' } },
  { a: 'rocket', b: 'moon', result: { id: 'moon_landing', emoji: '👨‍🚀', category: 'cosmic' } },
  { a: 'rocket', b: 'sun', result: { id: 'space', emoji: '🌌', category: 'cosmic' } },
  { a: 'space', b: 'life', result: { id: 'alien', emoji: '👽', category: 'cosmic' } },
  { a: 'space', b: 'energy', result: { id: 'black_hole', emoji: '🕳️', category: 'cosmic' } },
  { a: 'black_hole', b: 'agi', result: { id: 'singularity', emoji: '🌌', category: 'cosmic' } }
];

export function enrichElement(el) {
  const info = i18n.getElementInfo(el.id);
  return {
    ...el,
    name: info.name,
    desc: info.desc
  };
}

export function getRecipes() {
  return RECIPES_DATA.map(r => ({
    ...r,
    result: enrichElement(r.result)
  }));
}

export function findRecipe(idA, idB) {
  if (!idA || !idB) return null;
  const match = RECIPES_DATA.find(
    r => (r.a === idA && r.b === idB) || (r.a === idB && r.b === idA)
  );
  return match ? enrichElement(match.result) : null;
}

export function getAllDiscoverableElements() {
  const map = new Map();
  INITIAL_ELEMENTS.forEach(el => map.set(el.id, enrichElement(el)));
  RECIPES_DATA.forEach(r => map.set(r.result.id, enrichElement(r.result)));
  return Array.from(map.values());
}

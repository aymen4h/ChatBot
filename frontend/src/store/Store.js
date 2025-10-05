import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

export const userAtom = atomWithStorage('user', null);

// export const userAtom = atom(null);
export const conversationsAtom = atom([]);
export const currentConversationAtom = atom(null);
export const messagesAtom = atom([]);
export const selectedModelAtom = atom('mistral');
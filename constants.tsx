
import React from 'react';
import { LayoutDashboard, BookOpen, Sparkles, Activity, MessageSquare, Wind } from 'lucide-react';
import { Question } from './types';

export const QUESTIONS: Question[] = [
  { id: 1, text: "Je me sens souvent calme et serein(e)." },
  { id: 2, text: "Mon sommeil est réparateur." },
  { id: 3, text: "Je digère facilement mes repas." },
  { id: 4, text: "Je me sens plein(e) d'énergie au réveil." },
  { id: 5, text: "Je gère bien les situations imprévues." },
  { id: 6, text: "Je prends du temps pour moi chaque jour." },
  { id: 7, text: "Je me sens physiquement détendu(e)." },
  { id: 8, text: "Mon appétit est régulier." },
  { id: 9, text: "Je ris souvent et avec plaisir." },
  { id: 10, text: "J'ai une bonne concentration." },
  { id: 11, text: "Mes tensions musculaires sont rares." },
  { id: 12, text: "Je me sens en accord avec mes émotions." },
  { id: 13, text: "Je respire profondément sans effort." },
  { id: 14, text: "Mon esprit est clair et apaisé le soir." },
  { id: 15, text: "Je me sens globalement équilibré(e)." }
];

export const NAV_ITEMS = [
  { id: 'home', label: 'Accueil', icon: <LayoutDashboard size={20} /> },
  { id: 'journal', label: 'Journal', icon: <BookOpen size={20} /> },
  { id: 'program', label: 'Programme', icon: <Sparkles size={20} /> },
  { id: 'score', label: 'Équilibre', icon: <Activity size={20} /> },
  { id: 'followup', label: 'Suivi', icon: <MessageSquare size={20} /> },
  { id: 'breathing', label: 'Respiration', icon: <Wind size={20} /> },
];

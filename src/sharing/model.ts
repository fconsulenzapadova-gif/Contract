export const CHANNELS = ['Email', 'WhatsApp / messaggistica', 'Link', 'Videochiamata', 'Altro'] as const;
export const MATERIAL_KINDS = ['Scheda / brochure', 'Planimetrie', 'Foto / video', 'Documenti tecnici', 'Altro'] as const;
export const MAX_MATERIALS = 5;
export type DeliveryStatus = '' | 'sent' | 'pending';
export interface Material {
  id: string;
  kind: string;
  description: string;
  status: DeliveryStatus;
}
export interface SharingData {
  name: string;
  phone: string;
  email: string;
  address: string;
  reference: string;
  consultant: string;
  channels: string[];
  otherChannel: string;
  sharingDate: string;
  placeDate: string;
  privacyPlaceDate: string;
  materials: Material[];
}
export const FIELD_LIMITS = {
  name: 100, phone: 40, email: 100, address: 180, reference: 60,
  consultant: 100, otherChannel: 80, sharingDate: 40, placeDate: 80, privacyPlaceDate: 80,
} as const;
const text = (value: unknown): string => typeof value === 'string' ? value : '';
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
export function createMaterial(): Material {
  return {id: crypto.randomUUID(), kind: '', description: '', status: ''};
}
/** Preserve imported text; validation reports excess content instead of discarding it. */
export function normalizeSharingData(value: unknown): SharingData {
  const raw = object(value);
  const fields = Object.fromEntries(Object.keys(FIELD_LIMITS).map(key => [key, text(raw[key])])) as unknown as Omit<SharingData, 'channels' | 'materials'>;
  const seen = new Set<string>();
  const materials = (Array.isArray(raw.materials) && raw.materials.length ? raw.materials : [{}]).map(value => {
    const row = object(value);
    const id = text(row.id) && !seen.has(text(row.id)) ? text(row.id) : crypto.randomUUID();
    seen.add(id);
    return {id, kind: MATERIAL_KINDS.includes(row.kind as typeof MATERIAL_KINDS[number]) ? text(row.kind) : '',
      description: text(row.description), status: row.status === 'sent' || row.status === 'pending' ? row.status : ''} as Material;
  });
  return {...fields, materials, channels: CHANNELS.filter(channel => Array.isArray(raw.channels) && raw.channels.includes(channel))};
}
export function updateMaterial(data: SharingData, id: string, patch: Partial<Omit<Material, 'id'>>): SharingData {
  return {...data, materials: data.materials.map(row => row.id === id ? {...row, ...patch} : row)};
}
export function contentIssues(data: SharingData): string[] {
  const issues: string[] = [];
  if (data.materials.length > MAX_MATERIALS) issues.push(`Sono consentiti al massimo ${MAX_MATERIALS} materiali per scheda.`);
  for (const [key, limit] of Object.entries(FIELD_LIMITS)) {
    if (data[key as keyof typeof FIELD_LIMITS].length > limit) issues.push(`Il campo ${key} supera ${limit} caratteri: riduci il testo prima di stampare.`);
  }
  if (data.materials.some(row => row.description.length > 160)) issues.push('La descrizione di ciascun materiale può contenere al massimo 160 caratteri.');
  if (data.materials.some(row => row.description.split(/\r\n|\r|\n/).length > 3)) issues.push('Usa al massimo tre righe nella descrizione di ciascun materiale.');
  return issues;
}

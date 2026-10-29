export const CHANNELS = ['Email', 'WhatsApp / messaggistica', 'Link', 'Videochiamata', 'Altro'] as const;
export const MATERIAL_KINDS = ['Scheda / brochure', 'Planimetrie', 'Foto / video', 'Documenti tecnici', 'Altro'] as const;

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
export const TEXT_FIELDS = ['name', 'phone', 'email', 'address', 'reference', 'consultant', 'otherChannel', 'sharingDate', 'placeDate', 'privacyPlaceDate'] as const;
export type SharingTextField = typeof TEXT_FIELDS[number];
const text = (value: unknown): string => typeof value === 'string' ? value : '';
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
export function createMaterial(): Material {
  return {id: crypto.randomUUID(), kind: '', description: '', status: ''};
}
/** Preserve imported text and every material; page plans are derived by the preview. */
export function normalizeSharingData(value: unknown): SharingData {
  const raw = object(value);
  const fields = Object.fromEntries(TEXT_FIELDS.map(key => [key, text(raw[key])])) as unknown as Omit<SharingData, 'channels' | 'materials'>;
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
/** Kept for integrations: text length is handled by continuation pages. */
export function contentIssues(data: SharingData): string[] {
  void data;
  return [];
}

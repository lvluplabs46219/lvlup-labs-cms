import { createHash } from 'crypto';

function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function toMockCid(seed: string) {
  return `bafy${hashValue(seed).slice(0, 40)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function pinJson(label: string, data: unknown) {
  const body = JSON.stringify(data);
  const cid = toMockCid(`${label}:${body}`);

  return {
    cid,
    sha256: hashValue(body),
    uri: `ipfs://${cid}/${slugify(label)}.json`,
  };
}

export async function pinDocumentReference(label: string, sourcePath: string) {
  const seed = JSON.stringify({ label, sourcePath });
  const cid = toMockCid(seed);

  return {
    cid,
    sha256: hashValue(seed),
    uri: `ipfs://${cid}/${slugify(label)}.pdf`,
  };
}

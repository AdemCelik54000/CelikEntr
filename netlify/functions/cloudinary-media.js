const { v2: cloudinary } = require('cloudinary');

const MAX_RESULTS = 500;

function normalizeBaseFolder(value) {
  if (!value) {
    return 'celik-portfolio';
  }

  return value.replace(/^\/+|\/+$/g, '');
}

function ensureEntry(manifest, folderKey) {
  if (!manifest.entries[folderKey]) {
    manifest.entries[folderKey] = {
      media: [],
      hasUnsupportedMedia: false,
      unsupportedExtensions: [],
    };
  }

  return manifest.entries[folderKey];
}

function classifyExtension(extension, resourceType) {
  if (resourceType === 'video') {
    return 'video';
  }

  return 'image';
}

function toRelativeFolder(baseFolder, resourceFolder, publicId) {
  if (resourceFolder && resourceFolder.startsWith(baseFolder)) {
    const trimmed = resourceFolder.slice(baseFolder.length).replace(/^\/+/, '');
    return trimmed;
  }

  if (publicId && publicId.startsWith(`${baseFolder}/`)) {
    const withoutBase = publicId.slice(baseFolder.length + 1);
    const lastSlash = withoutBase.lastIndexOf('/');
    return lastSlash === -1 ? '' : withoutBase.slice(0, lastSlash);
  }

  return resourceFolder || '';
}

function toRelativePath(relativeFolder, publicId, extension) {
  const filename = publicId.split('/').pop();
  if (!filename) {
    return '';
  }

  const nameWithExt = extension ? `${filename}.${extension}` : filename;
  return relativeFolder ? `${relativeFolder}/${nameWithExt}` : nameWithExt;
}

async function fetchResources(resourceType, baseFolder) {
  const allResources = [];
  let nextCursor = undefined;

  do {
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${baseFolder}/`,
      resource_type: resourceType,
      max_results: MAX_RESULTS,
      context: true,
      next_cursor: nextCursor,
    });

    allResources.push(...(response.resources || []));
    nextCursor = response.next_cursor;
  } while (nextCursor);

  return allResources;
}

function buildManifest(baseFolder, resources) {
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: 'cloudinary',
    entries: {},
  };

  resources.forEach((resource) => {
    const extension = (resource.format || '').toLowerCase();
    const kind = classifyExtension(extension, resource.resource_type);
    const folderKey = toRelativeFolder(baseFolder, resource.folder || '', resource.public_id || '');
    const entry = ensureEntry(manifest, folderKey);
    const context = resource.context?.custom || resource.context || {};
    const positionRaw = context?.position;
    const position = Number.isFinite(Number(positionRaw)) ? Number(positionRaw) : null;

    if (kind === 'unsupported') {
      entry.hasUnsupportedMedia = true;
      if (extension && !entry.unsupportedExtensions.includes(extension)) {
        entry.unsupportedExtensions.push(extension);
      }
      return;
    }

    const relativePath = toRelativePath(folderKey, resource.public_id || '', extension);
    entry.media.push({
      name: resource.public_id ? resource.public_id.split('/').pop() : resource.asset_id,
      extension,
      kind,
      url: resource.secure_url,
      publicId: resource.public_id || null,
      relativePath,
      bytes: resource.bytes ?? null,
      width: resource.width ?? null,
      height: resource.height ?? null,
      createdAt: resource.created_at ?? null,
      position,
    });
  });

  Object.values(manifest.entries).forEach((entry) => {
    const media = entry.media ?? [];
    const hasPositions = media.length > 0 && media.every((item) => Number.isFinite(item.position));
    if (hasPositions) {
      media.sort((a, b) => (a.position || 0) - (b.position || 0));
    } else {
      media.sort((a, b) => {
        const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;
        if (aDate && bDate && aDate !== bDate) {
          return aDate - bDate;
        }
        if (aDate !== bDate) {
          return aDate - bDate;
        }
        return a.name.localeCompare(b.name);
      });
    }
    entry.unsupportedExtensions.sort();
  });

  return manifest;
}

exports.handler = async (event) => {
  const baseFolder = normalizeBaseFolder(event.queryStringParameters?.base);
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Cloudinary credentials.' }),
    };
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const [images, videos] = await Promise.all([
      fetchResources('image', baseFolder),
      fetchResources('video', baseFolder),
    ]);

    const manifest = buildManifest(baseFolder, [...images, ...videos]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify(manifest),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Cloudinary request failed.' }),
    };
  }
};

import crypto from 'crypto';

export const encryptData = (data: any, key: Buffer) => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
	encrypted += cipher.final('base64');

	// URL-encode the IV and the encrypted data
	const encodedIv = encodeURIComponent(iv.toString('base64'));
	const encodedEncrypted = encodeURIComponent(encrypted);

	return `${encodedIv}:${encodedEncrypted}`;
};

export const decryptData = (encryptedData: string, key: Buffer) => {
	const [ivBase64, encrypted] = encryptedData.split(':');

	if (!ivBase64 || !encrypted) return null;

	// URL-decode the IV and the encrypted data
	const iv = Buffer.from(decodeURIComponent(ivBase64), 'base64');
	const decodedEncrypted = decodeURIComponent(encrypted);

	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(decodedEncrypted, 'base64', 'utf8');
	decrypted += decipher.final('utf8');

	return JSON.parse(decrypted);
};

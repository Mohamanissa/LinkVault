export async function isUrlSafe(url) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;

  if (!apiKey) {
    console.warn('⚠️ Clé GOOGLE_SAFE_BROWSING_KEY manquante. Vérification ignorée.');
    return { safe: true, reason: 'no_api_key' };
  }

  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const requestBody = {
    client: {
      clientId: 'linkvault',
      clientVersion: '1.0.0',
    },
    threatInfo: {
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION',
      ],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }],
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API Safe Browsing:', response.status, errorText);
      return { safe: true, reason: 'api_error' };
    }

    const data = await response.json();

    if (data.matches && data.matches.length > 0) {
      console.log(`🚨 URL dangereuse détectée : ${url}`, data.matches);
      return {
        safe: false,
        reason: 'threat_detected',
        threats: data.matches.map((m) => m.threatType),
      };
    }

    return { safe: true, reason: 'clean' };
  } catch (error) {
    console.error('Erreur réseau Safe Browsing:', error);
    return { safe: true, reason: 'network_error' };
  }
}

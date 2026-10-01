import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Linking,
  ScrollView,
} from 'react-native';

const API_URL = 'http://192.168.166.169:3001';
const WHATSAPP_NUMBER = '237676130335';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [linksRes, catsRes] = await Promise.all([
          fetch(`${API_URL}/api/links`),
          fetch(`${API_URL}/api/categories`),
        ]);
        setLinks(await linksRes.json());
        setCategories(await catsRes.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = links.filter((l) => {
    if (activeCategory && l.category?.slug !== activeCategory) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        l.title.toLowerCase().includes(s) ||
        (l.description || '').toLowerCase().includes(s) ||
        (l.tags || '').toLowerCase().includes(s)
      );
    }
    return true;
  });

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour LinkVault')}`;
    Linking.openURL(url);
  };

  // ============ ÉCRAN ACCUEIL ============
  if (screen === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ScrollView contentContainerStyle={styles.homeScroll}>
          <View style={styles.homeHeader}>
            <Text style={styles.homeLogo}>🔐</Text>
            <Text style={styles.homeBrand}>LinkVault</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔒 Liens vérifiés et sécurisés</Text>
            </View>
            <Text style={styles.homeTitle}>
              Tous vos liens sécurisés au même endroit.
            </Text>
            <Text style={styles.homeSubtitle}>
              Animés, films, jeux vidéo, certifications et plus.
            </Text>
          </View>

          <View style={styles.homeStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{links.length}</Text>
              <Text style={styles.statLabel}>Liens</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{categories.length}</Text>
              <Text style={styles.statLabel}>Catégories</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.homeBtnPrimary}
            onPress={() => setScreen('links')}
          >
            <Text style={styles.homeBtnPrimaryText}>Accéder au Dashboard →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtnSecondary} onPress={openWhatsApp}>
            <Text style={styles.homeBtnSecondaryText}>💬 Contacter l'admin</Text>
          </TouchableOpacity>

          <Text style={styles.homeCatTitle}>Explorez par catégorie</Text>
          <View style={styles.homeCatGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.homeCatCard}
                onPress={() => {
                  setActiveCategory(cat.slug);
                  setScreen('links');
                }}
              >
                <Text style={styles.homeCatIcon}>{cat.icon}</Text>
                <Text style={styles.homeCatName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.homeFooter}>
            LinkVault · Liens vérifiés manuellement
          </Text>
        </ScrollView>

        <TouchableOpacity style={styles.whatsapp} onPress={openWhatsApp}>
          <Text style={styles.whatsappIcon}>💬</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ============ ÉCRAN CHARGEMENT ============
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e50914" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // ============ ÉCRAN ERREUR ============
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>❌ Erreur</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorHint}>
          Vérifie que le serveur web tourne et que tu es sur le même Wi-Fi
        </Text>
        <TouchableOpacity
          style={[styles.homeBtnPrimary, { marginTop: 20 }]}
          onPress={() => setScreen('home')}
        >
          <Text style={styles.homeBtnPrimaryText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ============ ÉCRAN LIENS ============
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={styles.backBtn}>← Accueil</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 Dashboard</Text>
        <View style={{ width: 70 }} />
      </View>

      <TextInput
        style={styles.search}
        placeholder="Rechercher..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterBtn, !activeCategory && styles.filterBtnActive]}
          onPress={() => setActiveCategory(null)}
        >
          <Text style={[styles.filterText, !activeCategory && styles.filterTextActive]}>
            Tous
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.filterBtn,
              activeCategory === cat.slug && styles.filterBtnActive,
            ]}
            onPress={() => setActiveCategory(cat.slug)}
          >
            <Text
              style={[
                styles.filterText,
                activeCategory === cat.slug && styles.filterTextActive,
              ]}
            >
              {cat.icon} {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => Linking.openURL(item.url)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardCategory}>
                {item.category?.icon} {item.category?.name}
              </Text>
              {item.isSecure && (
                <Text style={styles.secureBadge}>✓ Sécurisé</Text>
              )}
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <Text style={styles.cardLink}>Ouvrir ↗</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun lien trouvé</Text>
        }
      />

      <TouchableOpacity style={styles.whatsapp} onPress={openWhatsApp}>
        <Text style={styles.whatsappIcon}>💬</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  center: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // ===== ACCUEIL =====
  homeScroll: {
    paddingBottom: 100,
    paddingHorizontal: 24,
  },
  homeHeader: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 30,
  },
  homeLogo: { fontSize: 64, marginBottom: 8 },
  homeBrand: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: '#e50914',
    fontSize: 11,
    fontWeight: '500',
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
  },
  homeSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  homeStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
    minWidth: 100,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#e50914' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  homeBtnPrimary: {
    backgroundColor: '#e50914',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  homeBtnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeBtnSecondary: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 30,
  },
  homeBtnSecondaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  homeCatTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  homeCatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  homeCatCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
    minWidth: 100,
    flexGrow: 1,
  },
  homeCatIcon: { fontSize: 26, marginBottom: 4 },
  homeCatName: { fontSize: 11, color: '#ccc', fontWeight: '500' },
  homeFooter: {
    textAlign: 'center',
    color: '#444',
    fontSize: 11,
    marginTop: 20,
  },

  // ===== LIENS =====
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: { color: '#e50914', fontSize: 15, fontWeight: '500', width: 70 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  search: {
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#262626',
  },
  filtersContainer: { maxHeight: 50, marginBottom: 8 },
  filtersContent: { paddingHorizontal: 20, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: '#e50914' },
  filterText: { color: '#aaa', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardCategory: { color: '#e50914', fontSize: 11, fontWeight: '600' },
  secureBadge: {
    color: '#4ade80',
    fontSize: 10,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '600', marginBottom: 4 },
  cardDesc: { color: '#888', fontSize: 13, lineHeight: 18 },
  cardLink: { color: '#e50914', fontSize: 13, fontWeight: '600', marginTop: 10 },
  empty: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 15 },
  loadingText: { color: '#fff', marginTop: 12, fontSize: 15 },
  errorTitle: {
    color: '#e50914',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  errorHint: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  whatsapp: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  whatsappIcon: { fontSize: 28 },
});

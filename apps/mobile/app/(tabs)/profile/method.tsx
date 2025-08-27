import React from 'react';
import { ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, spacing, textVariants, useThemeColor } from '@/components/Themed';
import { initPaymentSheet, presentPaymentSheet, useStripe } from '@stripe/stripe-react-native';

// NOTE: Assumes STRIPE_PUBLISHABLE_KEY provided via native config (app.json / .env + build) if not supplied by endpoint.
// Flow: Call backend to create customer + ephemeral key + setup intent -> initPaymentSheet -> present -> card saved.

export default function PaymentMethodScreen() {
  const { initPaymentSheet: initSheet, presentPaymentSheet: presentSheet } = useStripe();
  const accent = useThemeColor({}, 'accent');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const [loading, setLoading] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const setupDataRef = React.useRef<{customerId:string}|null>(null);

  const fetchSetupIntent = async () => {
    // TODO: replace hardcoded path with env base url if needed
  const base = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';
  const res = await fetch(`${base}/api/stripe/setup-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const json = await res.json().catch(()=> ({}));
    if(!res.ok){
      const msg = json?.error || json?.detail || `Failed to create setup intent (${res.status})`;
      throw new Error(msg);
    }
    return json;
  };

  const prepareSheet = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSetupIntent();
      const { setupIntentClientSecret, ephemeralKey, customerId, publishableKey } = data;
      setupDataRef.current = { customerId };
      const { error } = await initSheet({
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret,
        merchantDisplayName: 'Commit (Test)',
        allowsDelayedPaymentMethods: false,
        returnURL: 'commit://stripe-redirect',
        style: 'automatic',
        appearance: { primaryButton: { shapes: { borderRadius: 12 } } },
      });
      if (error) {
        Alert.alert('Stripe Init Error', error.message);
        setReady(false);
      } else {
        setReady(true);
      }
    } catch (e:any) {
      Alert.alert('Error', e.message || 'Failed to setup payment sheet');
    } finally {
      setLoading(false);
    }
  }, [initSheet]);

  const openSheet = async () => {
    if (!ready) return;
    const { error } = await presentSheet();
    if (error) {
      Alert.alert('Payment Sheet', error.message);
    } else {
      Alert.alert('Success', 'Payment method saved for future charges (test mode).');
    }
  };

  React.useEffect(() => { prepareSheet(); }, [prepareSheet]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.headerContentInset, paddingTop: spacing.lg, paddingBottom: spacing.xxl }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={[textVariants.title3, { marginBottom: spacing.md }]}>Payment Method</Text>
        <Text style={[textVariants.body, { marginBottom: spacing.xl }]}>Ajoutez une carte (Visa / MasterCard) pour les débits automatiques de votre stake en cas d'échec. (Mode test)</Text>
        <Pressable
          disabled={loading}
          onPress={prepareSheet}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            padding: spacing.lg,
            borderRadius: 16,
            backgroundColor: card,
            borderWidth: 1,
            borderColor: border,
            marginBottom: spacing.lg,
          })}
        >
          <Text style={[textVariants.subheadlineEmphasized, { color: text }]}>Recharger configuration</Text>
          <Text style={[textVariants.caption1Emphasized, { marginTop: 4 }]}>Récupère un nouveau SetupIntent + clé éphémère</Text>
        </Pressable>
        <Pressable
          disabled={!ready || loading}
          onPress={openSheet}
          style={({ pressed }) => ({
            opacity: (!ready || loading) ? 0.4 : pressed ? 0.85 : 1,
            padding: spacing.lg,
            borderRadius: 16,
            backgroundColor: accent,
            alignItems: 'center',
          })}
        >
          {loading ? <ActivityIndicator color={'#fff'} /> : <Text style={textVariants.subheadlineEmphasized}>Ouvrir la feuille de paiement</Text>}
        </Pressable>
        <Text style={[textVariants.caption1Emphasized, { marginTop: spacing.lg }]}>La carte sauvegardée sera débitée automatiquement sans confirmation utilisateur supplémentaire (test).</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

import EmptyData from '@/components/basic/containers/EmptyData';
import LoadingScreen from '@/components/basic/containers/loadingScreen';
import ScreenView from '@/components/basic/containers/screenView';
import ThemeText from '@/components/basic/text/ThemeText';
import { ArrowLeftIcon } from '@/components/icons';
import API from '@/constants/api';
import { RootState } from '@/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux';

const FYLLO_CACHE_PREFIX = 'fyllo_service_cache_';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type FylloCache = {
  url: string;
  timestamp: number;
};

const FylloServices = () => {
  const { t } = useTranslation()
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // const phone = '9879879870'
  const phone = useSelector((state: RootState) => state?.auth?.currentUser?.phone)

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const cacheKey = `${FYLLO_CACHE_PREFIX}${phone}`;

  const fetchFylloService = useCallback(async () => {
    try {
      const res = await API.get(`/v1/get-fyllo-user-token?mobile=${phone}`);

      if (res.data?.status === 'success') {
        const url = res.data?.data?.url;
        if (isMounted.current) {
          setAddress(url);
          setError('');
        }
        try {
          const cache: FylloCache = { url, timestamp: Date.now() };
          await AsyncStorage.setItem(cacheKey, JSON.stringify(cache));
        } catch (e) {
          console.error('cache set err', e);
        }
      } else if (res.data?.status === 'error') {
        if (isMounted.current) {
          setAddress('');
          setError(res.data?.msg || 'Error while getting details');
        }
      }
    } catch (err) {
      console.error('err', err);
      if (isMounted.current) {
        setAddress('');
        setError('Something went wrong. Please try again.');
      }
    }
  }, [phone, cacheKey]);

  const loadCachedOrFetch = useCallback(async () => {
    setLoading(true);

    try {
      const raw = await AsyncStorage.getItem(cacheKey);
      if (raw) {
        const cache: FylloCache = JSON.parse(raw);
        const isExpired = Date.now() - cache.timestamp > ONE_DAY_MS;

        if (!isExpired && cache.url) {
          if (isMounted.current) setAddress(cache.url);
          setLoading(false);
          return;
        }
        await AsyncStorage.removeItem(cacheKey);
      }
    } catch (e) {
      console.error('cache read err', e);
    }

    await fetchFylloService();
    if (isMounted.current) setLoading(false);
  }, [cacheKey, fetchFylloService]);

  const handleRetry = useCallback(async () => {
    setLoading(true);
    await fetchFylloService();
    if (isMounted.current) setLoading(false);
  }, [fetchFylloService]);

  useEffect(() => {
    loadCachedOrFetch();
  }, [loadCachedOrFetch]);

  return (
    <ScreenView>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <Pressable
            onPress={() => router.back()}
            style={{
              padding: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ArrowLeftIcon />
            <ThemeText content={t('iot.back')} variant="sm" fontFamily="MontserratSemiBold" />
          </Pressable>

          {address ? (
            <>
              <WebView style={{ flex: 1 }} source={{ uri: address }} />
              <ThemeText content="Powered by Fyllo" severity="disabled" style={{ textAlign: 'center' }} />
            </>
          ) : (
            <EmptyData
              title={t('iot.error')}
              message={error || 'Please try again'}
              callback={{
                label: t('retry'),
                action: handleRetry,
              }}
            />
          )}
        </>
      )}
    </ScreenView>
  );
};

export default FylloServices;
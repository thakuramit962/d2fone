import EmptyData from '@/components/basic/containers/EmptyData';
import { Order } from '@/models/order';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SprayListItem from './sprayListItem';


export function useSprayList() {


    const renderOrderItem = React.useCallback(({ item, index }: { item: Order, index: number }) => (
        <SprayListItem
            key={item.id}
            detail={item}
            width={'auto'}
        />
    ), [])

    const ListEmptyComponent = () => {
        const { t } = useTranslation()

        return (
            <EmptyData
                title={t('sprayList.empty.title')}
                message={t('sprayList.empty.message')}
                callback={{
                    label: t('sprayList.empty.button'),
                    action: () => router.push('/sprays/bookSpray')
                }}
            />
        )
    }


    return {
        renderOrderItem,
        ListEmptyComponent
    }
} 

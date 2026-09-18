import BottomSheet from '@/components/basic/bottomSheet';
import ActionText from '@/components/basic/text/ActionText';
import { SprayRequest } from '@/models/sprayRequest';
import { dimensions } from '@/utils/app-helper';
import { useCallback, useMemo, useState } from 'react';
import { Actions } from './actions';
import DeleteRequest from './deleteRequest';
import EditRequest from './editRequest';

type ActionType = null | 'delete' | 'edit';

export const FarmerActionSheet = ({ open, onClose, spray }:
    { open: boolean, onClose: () => void, spray: SprayRequest }
) => {

    const [action, setAction] = useState<ActionType>(null);

    const closeSheet = useCallback(() => {
        setAction(null);
        onClose();
    }, [onClose]);

    const onEdit = useCallback(() => setAction('edit'), []);
    const onDelete = useCallback(() => setAction('delete'), []);

    const sheetHeight = useMemo(() => {
        if (action === 'edit') return dimensions.height - 120;
        if (action === 'delete') return dimensions.height * 0.65;
        return 400;
    }, [action]);

    return (
        <BottomSheet
            onClose={onClose}
            visible={open}
            height={sheetHeight}
        >
            {!action &&
                <>
                    <Actions
                        onDelete={onDelete}
                        onEdit={onEdit}
                        detail={spray}
                    />
                    <ActionText action={closeSheet} label='Close' severity='disabled' containerStyle={{ paddingBottom: 32 }} withIcon={false} />
                </>
            }
            {action === 'edit' && <EditRequest
                callback={closeSheet}
                detail={spray}
            />}
            {action === 'delete' && <DeleteRequest
                callback={closeSheet}
                detail={spray}
            />}
        </BottomSheet>
    );
};
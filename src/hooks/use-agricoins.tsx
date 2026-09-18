import API from "@/constants/api";
import { updateAuth } from "@/slices/auth-slice";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useAgricoins() {

    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth)

    const [ledger, setLedger] = useState([])
    const [loading, setLoading] = useState(false)


    const fetchAgricoins = useCallback(() => {
        setLoading(true)
        API.get("/v1/user-agricoin")
            .then((res) => {
                if (res.data?.status == 'success') {
                    if (user?.currentUser) {
                        dispatch(
                            updateAuth({
                                accessToken: user?.accessToken,
                                isLoggedIn: user?.isLoggedIn,
                                currentUser: {
                                    ...user?.currentUser,
                                    agricoin: {
                                        balance: res.data?.data.user_wallet?.balance || 0,
                                        created_at: res.data?.data.user_wallet?.created_at,
                                        lifetime_earned:
                                            res.data?.data.user_wallet?.lifetime_earned || 0,
                                        lifetime_spent:
                                            res.data?.data.user_wallet?.lifetime_spent || 0,
                                        sprayed_acres_current_fy:
                                            res.data.data?.total_sprayed_acreage || 0,
                                        fetched_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                                    },
                                },
                            }),
                        );
                    }
                }
            })
            .catch((err) => {
                console.error("err", err);
            })
            .finally(() => {
                setLoading(false)

            })
    }, []);



    const fetchAgricoinsLedger = () => {
        setLoading(true)
        API.get('/v1/user-agricoin-transaction')
            .then((res) => {
                if (res.data?.status == 'success') {
                    setLedger(res.data?.data)
                }
            })
            .catch((err) => {
                console.error("err", err);
            })
            .finally(() => {
                setLoading(false)
            })
        // /v1/user-agricoin-transaction
    }

    return {
        fetchAgricoins,
        fetchAgricoinsLedger,
        ledger,
        loading
    }
}


//    {
//       "coins": 25, // any number
//       "created_at": "2026-06-12T11:07:54.000000Z",
//       "description": null, // any string
//       "free_acreage": null, // any number
//       "reference": "AWFHR-1121", // any string
//       "source": "referral",  // 'register','spray','referral','spray_redemption','product_redemption','admin','bonus'
//       "type": "credit", // credit/debit
//     }